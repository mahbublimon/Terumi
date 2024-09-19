const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for banning the user')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = interaction.guild.members.cache.get(user.id);

    // Ban the user with a reason
    await member.ban({ reason });

    // Create an embed message for banning
    const embed = new EmbedBuilder()
      .setColor(0xFF0000) // Set color to red for banning
      .setTitle('User Banned')
      .setDescription(`${user.username} has been banned from the server.`)
      .addFields(
        { name: 'Reason', value: reason, inline: true },
        { name: 'Banned By', value: interaction.member.user.tag, inline: true }
      )
      .setTimestamp();

    // Send the embed message
    const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    // Set a timeout to delete the message after 10 seconds
    setTimeout(() => {
      interaction.deleteReply().catch(console.error); // Ensure the message is deleted
    }, 10000); // 10 seconds in milliseconds
  },
};
