// src/commands/moderation/mute.js
module.exports = {
  data: {
    name: 'mute',
    description: 'Mute a user for a specific duration',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to mute',
        required: true,
      },
      {
        name: 'duration',
        type: 'STRING',
        description: 'Duration to mute the user (e.g., 10m, 1h)',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'The reason for muting',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const msDuration = require('ms')(duration);
    if (!msDuration || msDuration < 1000) return interaction.reply('Invalid duration provided.');

    try {
      await user.timeout(msDuration, reason);
      await interaction.reply(`${user.user.tag} has been muted for ${duration} for: ${reason}`);
    } catch (error) {
      await interaction.reply('Failed to mute the user.');
    }
  },
};
