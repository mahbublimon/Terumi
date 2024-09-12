const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder-remove')
    .setDescription('Remove your active reminder'),

  async execute(interaction) {
    if (reminders.has(interaction.user.id)) {
      reminders.delete(interaction.user.id);
      return interaction.reply({ content: 'Your reminder has been removed.', ephemeral: true });
    }

    return interaction.reply({ content: 'You don’t have any active reminders.', ephemeral: true });
  },
};
