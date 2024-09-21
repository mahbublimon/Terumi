const { InteractionType } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  name: 'interactionCreate',
  
  async execute(interaction) {
    if (interaction.isButton()) {
      const [action, ticketId] = interaction.customId.split('_');

      if (action === 'closeTicket') {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
          return interaction.reply({ content: 'Ticket not found.', ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.get(ticket.channelID);

        if (channel) {
          await interaction.client.emit('ticketClose', channel); // Emit the ticketClose event
        }
      }
    }

    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
      }
    }
  }
};
