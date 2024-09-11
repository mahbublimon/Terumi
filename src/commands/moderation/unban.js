// src/commands/moderation/unban.js
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'unban',
    description: 'Unban a user by their ID',
    options: [
      {
        name: 'user_id',
        type: 'STRING',
        description: 'ID of the user to unban',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for unbanning the user',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason');

    await interaction.guild.members.unban(userId);
    await interaction.reply(`User with ID ${userId} has been unbanned. Reason: ${reason}`);
  },
};
