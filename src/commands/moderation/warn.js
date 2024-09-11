// src/commands/moderation/warn.js
const hasModerationPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'warn',
    description: 'Warn a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to warn',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for warning',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!(await hasModerationPermissions(interaction.member))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    await user.send(`You have been warned for the following reason: ${reason}`);
    await interaction.reply(`Warned ${user.username} for: ${reason}`);
  },
};
