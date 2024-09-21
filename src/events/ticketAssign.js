const Ticket = require('../models/Ticket');
const autoAssign = require('../utils/autoAssign');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ticketAssign',
  
  async execute(ticket, member) {
    // Assign a new support member if not already assigned
    let supportStaff;

    if (!ticket.supportID) {
      supportStaff = await autoAssign.assignSupport();
      ticket.supportID = supportStaff.id;
      await ticket.save();
    } else {
      supportStaff = await member.guild.members.fetch(ticket.supportID);
    }

    const channel = member.guild.channels.cache.get(ticket.channelID);
    
    if (!channel) {
      console.error(`Channel for ticket ${ticket.id} not found.`);
      return;
    }

    // Notify the channel about the support assignment
    const embed = new EmbedBuilder()
      .setTitle(`Support Assigned`)
      .setDescription(`Support member **${supportStaff.user.tag}** has been assigned to this ticket.`)
      .setColor('YELLOW')
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    // Update channel permissions to allow the support staff to see and interact in the channel
    await channel.permissionOverwrites.edit(supportStaff.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });
  }
};
