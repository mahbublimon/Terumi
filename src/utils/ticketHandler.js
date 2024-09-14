const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Ticket = require('../models/Ticket');
const TicketSettings = require('../models/TicketSettings');

module.exports = {
  // Create a ticket for the user
  async createTicket(interaction, user) {
    const guild = interaction.guild;
    const settings = await TicketSettings.findOne({ guildID: guild.id });

    // Check if ticket system is set up
    if (!settings || !settings.ticketChannel) {
      return interaction.reply({ content: 'Ticket system is not configured.', ephemeral: true });
    }

    // Check if user already has an open ticket
    const existingTicket = await Ticket.findOne({ userID: user.id, guildID: guild.id, status: 'open' });
    if (existingTicket) {
      return interaction.reply({ content: 'You already have an open ticket!', ephemeral: true });
    }

    // Create a new ticket channel under the ticket category
    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: 0, // GUILD_TEXT type
      parent: settings.ticketChannel,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        ...settings.managerRoles.map(roleID => ({
          id: roleID,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        })),
      ],
    });

    // Save ticket data in the database
    await Ticket.create({
      ticketID: ticketChannel.id,
      userID: user.id,
      channelID: ticketChannel.id,
      guildID: guild.id,
    });

    // Send the initial message in the ticket channel
    const initialEmbed = new EmbedBuilder()
      .setColor('GREEN')
      .setDescription(settings.initialMessage || 'Please describe your issue, and a support team member will assist you shortly.');

    await ticketChannel.send({ content: `${user}`, embeds: [initialEmbed] });

    interaction.reply({ content: 'Your ticket has been created!', ephemeral: true });
  },

  // Close a ticket and send the transcript to the specified channel
  async closeTicket(interaction, ticketID) {
    const guild = interaction.guild;
    const ticket = await Ticket.findOne({ ticketID, status: 'open' });

    if (!ticket) {
      return interaction.reply({ content: 'Ticket not found or already closed.', ephemeral: true });
    }

    const settings = await TicketSettings.findOne({ guildID: guild.id });
    if (!settings || !settings.transcriptChannel) {
      return interaction.reply({ content: 'Transcript channel is not configured.', ephemeral: true });
    }

    const transcriptChannel = guild.channels.cache.get(settings.transcriptChannel);
    if (!transcriptChannel) {
      return interaction.reply({ content: 'Transcript channel not found.', ephemeral: true });
    }

    const ticketChannel = guild.channels.cache.get(ticket.channelID);
    if (!ticketChannel) {
      return interaction.reply({ content: 'Ticket channel not found.', ephemeral: true });
    }

    // Fetch all messages from the ticket channel for the transcript
    const messages = await ticketChannel.messages.fetch();
    const transcript = messages.map(msg => `${msg.author.tag}: ${msg.content}`).reverse().join('\n');

    // Send the transcript to the transcript channel
    const transcriptEmbed = new EmbedBuilder()
      .setColor('ORANGE')
      .setTitle(`Ticket Closed: ${ticketChannel.name}`)
      .setDescription(`**Transcript:**\n${transcript}`);

    await transcriptChannel.send({ embeds: [transcriptEmbed] });

    // Update the ticket status and delete the ticket channel
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    await ticketChannel.delete();

    return interaction.reply({ content: 'Ticket closed and transcript sent.', ephemeral: true });
  },

  // Add permissions for a user to join an existing ticket
  async allowUserInTicket(ticketID, user, interaction) {
    const ticket = await Ticket.findOne({ ticketID, status: 'open' });

    if (!ticket) {
      return interaction.reply({ content: 'Ticket not found or already closed.', ephemeral: true });
    }

    const ticketChannel = interaction.guild.channels.cache.get(ticket.channelID);
    if (!ticketChannel) {
      return interaction.reply({ content: 'Ticket channel not found.', ephemeral: true });
    }

    // Add permissions for the user to access the ticket
    await ticketChannel.permissionOverwrites.edit(user.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    return interaction.reply({ content: `${user.username} has been given access to this ticket.`, ephemeral: true });
  },
};
