const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection
} = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');
const finalOptions = ['sillyFace', 'nerdFace', 'heartFace', 'laughFace'];

let previousIndex = -1;
let currentIndex = -1;

let {
  final
} = require('./commands/Auth/auth-setup');
let {
  getFinal
} = require('./commands/Auth/auth-setup');

const maxAttempts = 2;
let failedAttempts = new Map();

(async () => {
  for (const file of functions) {
     require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, './src/events');
  client.handleCommands(commandFolders, './src/commands');

  setInterval(() => {
     do {
        currentIndex = Math.floor(Math.random() * finalOptions.length);
     } while (currentIndex === previousIndex);

     previousIndex = currentIndex;
     final = finalOptions[currentIndex];
  }, 60000);

  client.login(process.env.token);
})();

const authSchema = require('./schemas/authSchema');

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (finalOptions.slice().includes(interaction.customId)) {
     const guildId = interaction.guild.id;
     authSchema.findOne({
        Guild: guildId
     }, async (err, data) => {
        if (data) {
           const roleId = data.Role;
           const timestamp = Math.floor(Date.now() / 1000);
           const member = interaction.member;

           const dmEmbed = new EmbedBuilder()
              .setTitle('🔒 Authentification')
              .setDescription(`👋  Bonjour ${member}, félicitations ! Vous avez désormais **accès** au serveur \`${interaction.guild.name}\`.`)
              .addFields({
                 name: '📆 Vérifié',
                 value: `<t:${timestamp}:R>`,
                 inline: true
              })
              .setFooter({
                 text: interaction.user.tag,
                 iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                 }),
              })
              .setTimestamp()
              .setColor('#01ba01');

           const role = interaction.guild.roles.cache.get(roleId);
           if (role) {
              if (member.roles.cache.has(roleId)) {
                 const errorEmbed = new EmbedBuilder()
                    .setTitle('🔒 Authentification Échouée')
                    .setDescription(`> ❌  Vous êtes déjà vérifié sur le serveur \`${interaction.guild.name}\`.`)
                    .setFooter({
                       text: interaction.user.tag,
                       iconURL: interaction.user.displayAvatarURL({
                          dynamic: true
                       }),
                    })
                    .setTimestamp()
                    .setColor('#da4744');
                 await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                 });
                 return;
              }

              const expectedFinal = getFinal(guildId);
              const selectedIndex = finalOptions.indexOf(interaction.customId);
              if (selectedIndex === finalOptions.indexOf(expectedFinal)) {
                 await member.roles.add(roleId);
                 member.send({
                    embeds: [dmEmbed]
                 });
                 const successEmbed = new EmbedBuilder()
                    .setTitle('🔓 Authentification Réussie')
                    .setDescription(`> ✅  ${member}, votre compte est désormais **vérifié** sur le serveur \`${interaction.guild.name}\` !`)
                    .addFields({
                       name: '📆 Vérifié',
                       value: `<t:${timestamp}:R>`,
                       inline: false
                    }, {
                       name: '🎭 Rôle attribué',
                       value: `${role}`,
                       inline: false
                    }, )
                    .setFooter({
                       text: interaction.user.tag,
                       iconURL: interaction.user.displayAvatarURL({
                          dynamic: true
                       }),
                    })
                    .setTimestamp()
                    .setColor('#01ba01');
                 await interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                 });
              } else {
                 let attempts = failedAttempts.get(interaction.user.id) || 0;
                 attempts++;
                 failedAttempts.set(interaction.user.id, attempts);

                 if (attempts >= maxAttempts) {
                    await member.kick('Trop d\'authentifications incorrectes.');

                    failedAttempts.delete(interaction.user.id);

                    const kickEmbed = new EmbedBuilder()
                       .setTitle('🔒 Authentification Échouée')
                       .setDescription(`> ❌  Trop d\'authentifications incorrectes. ${member} a été expulsé du serveur.`)
                       .setTimestamp()
                       .setFooter({
                          text: interaction.user.tag,
                          iconURL: interaction.user.displayAvatarURL({
                             dynamic: true
                          }),
                       })
                       .setColor('#da4744');
                    const reply = await interaction.reply({
                       embeds: [kickEmbed],
                       ephemeral: false
                    });
                    setTimeout(async () => {
                       await reply.delete();
                    }, 10000);
                 } else {
                    const errorEmbed = new EmbedBuilder()
                       .setTitle('🔒 Authentification Échouée')
                       .setDescription(`> ❌  Veuillez réessayer, l'emoji sélectionné n'est pas le bon.`)
                       .setFooter({
                          text: interaction.user.tag,
                          iconURL: interaction.user.displayAvatarURL({
                             dynamic: true
                          }),
                       })
                       .setTimestamp()
                       .setColor('#da4744');
                    await interaction.reply({
                       embeds: [errorEmbed],
                       ephemeral: true
                    });
                 }
              }
           } else {
              const errorEmbed = new EmbedBuilder()
                 .setTitle('🔒 Authentification Échouée')
                 .setDescription(`> ❌  Le rôle de vérification n'a pas été correctement configuré sur le serveur \`${interaction.guild.name}\`.`)
                 .setFooter({
                    text: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({
                       dynamic: true
                    }),
                 })
                 .setTimestamp()
                 .setColor('#da4744');

              await interaction.reply({
                 embeds: [errorEmbed],
                 ephemeral: true
              });
           }
        }
     });
  }
});
