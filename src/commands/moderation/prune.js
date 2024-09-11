// src/commands/moderation/prune.js
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'prune',
    description: 'Delete a specified number of messages',
    options: [
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Number of messages to delete',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.reply('You must delete between 1 and 100 messages.');
    }

    const messages = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`Successfully deleted ${messages.size} messages.`);
  },
};
