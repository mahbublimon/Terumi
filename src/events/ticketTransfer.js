const Ticket = require('../models/Ticket');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ticketTransfer',
  
  async execute(ticket, newSupportMember) {
    const channel = await ticket.guild.channels.cache.get(ticket.channelID);

    if (!channel) {
      console.error('Channel not found for ticket transfer.');
      return;
    }

    // Update the support ID in the ticket database
    ticket.supportID = newSupportMember.id;
    await ticket.save();

    // Update permissions to grant new support member access
    await channel.permissionOverwrites.edit(newSupportMember.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    // Notify the channel about the support member change
    const embed = new EmbedBuilder()
      .setTitle(`Ticket Transferred`)
      .setDescription(`Ticket has been transferred to ${newSupportMember.user.tag}.`)
      .setColor('BLUE')
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
