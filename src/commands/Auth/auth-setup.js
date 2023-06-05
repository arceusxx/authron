const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const { shuffle } = require('lodash');

const authSchema = require('../../schemas/authSchema');

let finalOptions = ['sillyFace', 'nerdFace', 'heartFace', 'laughFace'];
let chosenEmojiOptions = {
  sillyFace: 'avec la langue tirée et les yeux fermés',
  nerdFace: 'de nerd',
  heartFace: 'souriant avec des yeux en forme de cœur',
  laughFace: 'avec des larmes de joie'
};
let final = finalOptions[Math.floor(Math.random() * finalOptions.length)];
let chosenEmoji = chosenEmojiOptions[final];


const changeEmojiOrder = () => {
  finalOptions = shuffle(finalOptions);
  final = finalOptions[Math.floor(Math.random() * finalOptions.length)];
  chosenEmoji = chosenEmojiOptions[final];
  
};

const updateMessage = (message, row) => {
  const embed = new EmbedBuilder()
    .setTitle('🔒 Authentification')
    .setDescription(`Bienvenue ! Veuillez sélectionner le **visage ${chosenEmoji}** pour prouver que vous êtes un humain.`)
    .addFields({ name: `🤔 Pourquoi ?`, value: `Ce captcha est mis en place pour distinguer les utilisateurs humains des programmes automatisés et assurer la sécurité du serveur.`, inline: true })
    .setTimestamp()
    .setColor('#0099ff');

  message.edit({
    embeds: [embed],
    components: [row]
  });
};

module.exports = {
  getFinal: function() {
    return final;
  },
  resetTimestamp() {
    timestamp = Math.floor(Date.now() / 1000);
  },
  final: final,
  data: new SlashCommandBuilder()
    .setName('auth-setup')
    .setDescription('Configurer et activer l\'authentification à emojis.')
    .setDMPermission(false)
    .addChannelOption(option => option
      .setName('salon')
      .setDescription('Salon qui sera utilisé pour la vérification à emojis.')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption(option => option
      .setName('role')
      .setDescription('Rôle à attribuer aux utilisateurs vérifiés.')
      .setRequired(true)
    ),

  async execute(interaction, client) {
    const guildMember = await interaction.guild.members.fetch(client.user.id);
    const botMember = guildMember;
    const authronRole = guildMember.roles.cache.find(role => role.name === 'Authron');
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('🔒 Authentification Échouée')
        .setDescription('> ❌  La permission `GERER_LES_SALONS` est requise pour configurer et activer l\'authentification à emojis.')
        .setTimestamp()
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setColor('#da4744');
      
      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel('salon');
    const role = interaction.options.getRole('role');

    await interaction.guild.roles.fetch();

    if (role.position >= botMember.roles.highest.position || role.name === '@everyone' || role.managed) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('🔒 Authentification Échouée')
        .setDescription('> ❌ Le rôle sélectionné est invalide ou au-dessus de Authron ou de votre rôle.')
        .setTimestamp()
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setColor('#da4744');

      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
      return;
    }

    authSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) {
        authSchema.create({
          Guild: interaction.guild.id,
          Channel: channel.id,
          Role: role.id
        });
      } else {
        const errorEmbed = new EmbedBuilder()
          .setTitle('🔒 Authentification Échouée')
          .setDescription('> ❌  Une authentification à emojis est déjà en place. Pour la reconfigurer, utilisez `/auth-disable`.')
          .addFields(
            { name: `🎭 Rôle de vérification`, value: `${role}`, inline: false},
            { name: `#️⃣ Salon de vérification`, value: `${channel}`, inline: false}
          )
          .setTimestamp()
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor('#da4744');

        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true
        });
        return;
      }

      const sillyFace = new ButtonBuilder()
        .setCustomId('sillyFace')
        .setEmoji('🤪')
        .setStyle(ButtonStyle.Secondary);

      const nerdFace = new ButtonBuilder()
        .setCustomId('nerdFace')
        .setEmoji('🤓')
        .setStyle(ButtonStyle.Secondary);

      const heartFace = new ButtonBuilder()
        .setCustomId('heartFace')
        .setEmoji('😍')
        .setStyle(ButtonStyle.Secondary);

      const laughFace = new ButtonBuilder()
        .setCustomId('laughFace')
        .setEmoji('😂')
        .setStyle(ButtonStyle.Secondary);

      const buttons = shuffle([sillyFace, nerdFace, heartFace, laughFace]);
      const row = new ActionRowBuilder()
        .addComponents(...buttons);

      const embed = new EmbedBuilder()
        .setTitle('🔒 Authentification')
        .setDescription(`Bienvenue ! Veuillez sélectionner le **visage ${chosenEmoji}** pour prouver que vous êtes un humain.`)
        .addFields({ name: `🤔  Pourquoi ?`, value: `Ce captcha est mis en place pour distinguer les utilisateurs humains des programmes automatisés et assurer la sécurité du serveur.`, inline: true })
        .setTimestamp()
        .setColor('#0099ff');

      const message = await channel.send({
        embeds: [embed],
        components: [row]
      });

      setInterval(changeEmojiOrder, 60 * 1000);
      setInterval(() => updateMessage(message, row), 60 * 1000);

      const timestamp = Math.floor(Date.now() / 1000);


      const successEmbed = new EmbedBuilder()
        .setTitle('🔒 Authentification Réussie')
        .setDescription('> ✅  L\'authentification à emojis a été configurée et activée avec succès !')
        .addFields(
          { name: `⚙️ Activée`, value: `<t:${timestamp}:R>`, inline: false},
          { name: `🎭 Rôle de vérification`, value: `${role}`, inline: false},
          { name: `#️⃣ Salon de vérification`, value: `${channel}`, inline: false}
        )
        .setTimestamp()
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setColor('#01ba01');

      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true
      });
    });
  }
};
