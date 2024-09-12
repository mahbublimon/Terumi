// src/events/client/interactionCreate.js
const ticketHandler = require('../../utils/ticketHandler');

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {
    await ticketHandler.createTicket(interaction, interaction.user);
  }
};
