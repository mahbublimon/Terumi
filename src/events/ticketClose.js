const Ticket = require('../models/Ticket');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ticketClose',
  
  async execute(channel) {
    // Find the ticket by the channel ID
    const ticket = await Ticket.findOne({ channelID: channel.id });

    if (!ticket) {
      console.log(`No active ticket found for channel ${channel.id}`);
      return;
    }

    // Change the status of the ticket to closed
    ticket.status = 'closed';
    await ticket.save();

    // Notify the user and the support staff that the ticket is closed
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Closed`)
      .setDescription(`This ticket has been closed. Thank you for reaching out!`)
      .setColor('RED')
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    // Optionally archive the channel and delete it after a delay (e.g., 1 minute)
    setTimeout(() => {
      channel.delete().catch(err => console.error('Failed to delete channel:', err));
    }, 60000); // Delete after 1 minute
  }
};
