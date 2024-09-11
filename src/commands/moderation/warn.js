// src/commands/moderation/warn.js
module.exports = {
  data: {
    name: 'warn',
    description: 'Warn a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to warn',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'The reason for the warning',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    try {
      await user.send(`You have been warned for: ${reason}`);
      await interaction.reply(`${user.tag} has been warned for: ${reason}`);
    } catch (error) {
      await interaction.reply('Failed to warn the user. They may have DMs disabled.');
    }
  },
};
