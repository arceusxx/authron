const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const authSchema = require('../../schemas/authSchema');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('auth-disable')
  .setDescription('Désactiver l\'authentification à emojis.')
  .setDMPermission(false),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('🔒 Authentification Échouée')
        .setDescription('> ❌  La permission `GERER_LES_SALONS` est requise pour désactiver l\'authentification à emojis.')
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

    const existingAuth = await authSchema.findOne({ Guild: interaction.guild.id });

    if (!existingAuth) {
      const noAuthEmbed = new EmbedBuilder()
        .setTitle('🔒 Authentification Échouée')
        .setDescription('> ❌  Aucune authentification à emojis n\'est en place.')
        .setTimestamp()
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setColor('#da4744');

      return await interaction.reply({
        embeds: [noAuthEmbed],
        ephemeral: true
      });
    }
    
    authSchema.deleteMany({ Guild: interaction.guild.id }, async (err, data) => {
      const successEmbed = new EmbedBuilder()
        .setTitle('🔓 Authentification Réussie')
        .setDescription('> ✅  L\'authentification à emojis a été désactivée avec succès !')
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

      const channel = interaction.channel;

      try {
        const messages = await channel.messages.fetch();
        const authSetupMessage = messages.find((msg) => 
                msg.embeds.length && msg.embeds[0].title === '🔒 Authentification'
        );

        if (authSetupMessage) {
          await authSetupMessage.delete();
        }
      } catch (error) {
        console.error('Erreur de suppression pour `auth-setup`:', error);

      }
    });
  }
};