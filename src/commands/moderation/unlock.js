const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to unlock')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: true });

    const embed = new EmbedBuilder()
      .setTitle('Channel Unlocked')
      .setColor(0x00FF00)
      .addFields({ name: 'Channel', value: `${channel.name}`, inline: true });

    const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 10000);
  },
};
