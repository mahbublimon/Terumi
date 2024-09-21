const { ChannelType, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../models/Ticket');
const autoAssign = require('../utils/autoAssign'); // For auto-assigning staff members

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    // Create a ticket if the user clicks "Create Ticket"
    if (interaction.customId === 'create-ticket-button') {
      const ticketId = Math.random().toString(36).substring(2, 8); // Generate a random ticket ID
      const staff = await autoAssign(interaction.guild); // Auto-assign a staff member

      // Create a private channel for the ticket
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${ticketId}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: staff.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });

      // Store the ticket in the database
      await Ticket.create({
        userId: interaction.user.id,
        channelId: ticketChannel.id,
        staffId: staff.id,
        status: 'open',
      });

      await interaction.reply({ content: `Ticket created! A staff member has been assigned: ${staff}.`, ephemeral: true });

      ticketChannel.send(`Ticket #${ticketId} created by <@${interaction.user.id}>. Assigned staff: <@${staff.id}>.`);
    }
  },
};
