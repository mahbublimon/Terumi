// src/commands/moderation/unmute.js
module.exports = {
  data: {
    name: 'unmute',
    description: 'Unmute a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to unmute',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'The reason for unmuting',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    try {
      await user.timeout(null); // Removes the timeout
      await interaction.reply(`${user.user.tag} has been unmuted for: ${reason}`);
    } catch (error) {
      await interaction.reply('Failed to unmute the user.');
    }
  },
};
