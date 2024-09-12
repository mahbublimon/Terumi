const { SlashCommandBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prune')
    .setDescription('Delete a specified number of messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)),

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
