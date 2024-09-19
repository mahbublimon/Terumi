const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasModerationPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true)),

  async execute(interaction) {
    if (!(await hasModerationPermissions(interaction.member))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    // Send the warning as a DM to the user
    try {
      await user.send(`You have been warned for the following reason: ${reason}`);
      const embed = new EmbedBuilder()
        .setTitle('User Warned')
        .setColor(0xFFAA00)
        .addFields(
          { name: 'User', value: `${user.username}`, inline: true },
          { name: 'Reason', value: reason, inline: true }
        );

      const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

      setTimeout(() => {
        interaction.deleteReply().catch(console.error);
      }, 10000);
    } catch (error) {
      await interaction.reply(`Failed to send a DM to ${user.username}, but they have been warned for: ${reason}`);
    }
  },
};
