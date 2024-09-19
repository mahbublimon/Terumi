const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their ID')
    .addStringOption(option =>
      option.setName('user_id')
        .setDescription('ID of the user to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unbanning the user')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason');

    await interaction.guild.members.unban(userId);

    const embed = new EmbedBuilder()
      .setTitle('User Unbanned')
      .setColor(0x00FF00)
      .addFields(
        { name: 'User ID', value: userId, inline: true },
        { name: 'Reason', value: reason, inline: true }
      );

    const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 10000);
  },
};
