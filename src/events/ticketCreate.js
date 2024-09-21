const Ticket = require('../models/Ticket');
const autoAssign = require('../utils/autoAssign');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  
  async execute(member) {
    const guildID = member.guild.id;
    const role = member.guild.roles.cache.find(r => r.name === "Support");
    if(role){
       member.roles.add(role);
    }
    console.log("Member ", member.displayName ,"was successfully added");
    // Fetch any previous open tickets for this member
    const openTicket = await Ticket.findOne({ userID: member.id, status: 'open' });

    if (openTicket) {
      console.log(`User ${member.user.tag} already has an open ticket.`);
      return;
    }

    // Create a new ticket in the database
    const ticket = await Ticket.create({
      userID: member.id,
      supportID: null, // This will be assigned later
      status: 'open',
      issue: 'New ticket created by system on member join' // Default issue
    });

    // Automatically assign a support staff using the auto-assign utility
    const supportStaff = await autoAssign.assignSupport();

    if (!supportStaff) {
      console.error('No available support staff for ticket assignment.');
      return;
    }

    // Create a private channel for the ticket in the server
    const ticketChannel = await member.guild.channels.create(`ticket-${ticket.id}`, {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        {
          id: member.guild.id, // Block everyone from viewing
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: member.id, // Allow the user who created the ticket to view and send messages
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
          id: supportStaff.id, // Allow assigned support staff to view and send messages
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
      ],
    });

    // Update the ticket in the database with the channel ID and support ID
    ticket.channelID = ticketChannel.id;
    ticket.supportID = supportStaff.id;
    await ticket.save();

    // Send a message to the newly created channel to notify the user and the support staff
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Created`)
      .setDescription(`Ticket for **${member.user.tag}** has been created and assigned to ${supportStaff.user.tag}.`)
      .setColor('GREEN')
      .setTimestamp();

    await ticketChannel.send({ content: `<@${supportStaff.id}>`, embeds: [embed] });
  }
};
