// src/commands/misc/reminderRemove.js
module.exports = {
  data: {
    name: 'reminder-remove',
    description: 'Remove your active reminder',
  },
  async execute(interaction) {
    if (reminders.has(interaction.user.id)) {
      reminders.delete(interaction.user.id);
      return interaction.reply('Your reminder has been removed.', { ephemeral: true });
    }

    return interaction.reply('You don’t have any active reminders.', { ephemeral: true });
  },
};
