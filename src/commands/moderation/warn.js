const { SlashCommandBuilder } = require('discord.js');
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
    // Check if the member has moderation permissions
    if (!(await hasModerationPermissions(interaction.member))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    // Send the warning as a DM to the user
    try {
      await user.send(`You have been warned for the following reason: ${reason}`);
      await interaction.reply(`Warned ${user.username} for: ${reason}`);
    } catch (error) {
      // Handle cases where the user has DMs disabled
      await interaction.reply(`Failed to send a DM to ${user.username}, but they have been warned for: ${reason}`);
    }
  },
};
