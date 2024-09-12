// src/commands/tickets/closeTicket.js
const ticketHandler = require('../../utils/ticketHandler');

module.exports = {
  data: {
    name: 'close-ticket',
    description: 'Close a support ticket',
    options: [
      {
        name: 'ticket_id',
        type: 'STRING',
        description: 'The ID of the ticket to close',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const ticketID = interaction.options.getString('ticket_id');
    await ticketHandler.closeTicket(interaction, ticketID);
  },
};
