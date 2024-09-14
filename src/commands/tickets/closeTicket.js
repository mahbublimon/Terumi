const { SlashCommandBuilder } = require('discord.js');
const ticketHandler = require('../../utils/ticketHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close a support ticket')
    .addStringOption(option => 
      option.setName('ticket_id')
        .setDescription('The ID of the ticket to close')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketID = interaction.options.getString('ticket_id');
    await ticketHandler.closeTicket(interaction, ticketID);
  },
};
