// src/utils/ticketHandler.js
const { MessageEmbed, Permissions } = require('discord.js');
const Ticket = require('../models/Ticket');
const TicketSettings = require('../models/TicketSettings');

module.exports = {
  /**
   * Create a new ticket for a user.
   * @param {GuildMember} member - The member who created the ticket.
   * @param {Guild} guild - The guild where the ticket is being created.
   * @param {TextChannel} interactionChannel - The channel where the interaction was created.
   * @returns {Promise<TextChannel>} The newly created ticket channel.
   */
  async createTicket(member, guild, interactionChannel) {
    const settings = await TicketSettings.findOne({ guildID: guild.id });

    if (!settings || !settings.ticketChannel) {
      throw new Error('Ticket channel is not set up.');
    }

    // Check if the user already has an open ticket
    const existingTicket = await Ticket.findOne({ userID: member.id, guildID: guild.id, status: 'open' });
    if (existingTicket) {
      throw new Error('You already have an open ticket.');
    }

    // Create a new ticket channel
    const ticketChannel = await guild.channels.create(`ticket-${member.user.username}`, {
      type: 'GUILD_TEXT',
      parent: settings.ticketChannel,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: member.id,
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],
        },
        ...settings.managerRoles.map((roleID) => ({
          id: roleID,
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],
        })),
      ],
    });

    // Save ticket to the database
    await Ticket.create({
      ticketID: ticketChannel.id,
      userID: member.id,
      channelID: ticketChannel.id,
      guildID: guild.id,
    });

    // Send the initial message in the ticket channel
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(settings.initialMessage || 'Thank you for opening a ticket! Please explain your issue.');

    ticketChannel.send({ embeds: [embed] });

    return ticketChannel;
  },

  /**
   * Close a ticket and send the transcript to the designated transcript channel.
   * @param {TextChannel} ticketChannel - The ticket channel that needs to be closed.
   * @param {GuildMember} member - The member closing the ticket.
   * @param {Guild} guild - The guild where the ticket is being closed.
   * @returns {Promise<void>}
   */
  async closeTicket(ticketChannel, member, guild) {
    const ticket = await Ticket.findOne({ channelID: ticketChannel.id, status: 'open' });

    if (!ticket) {
      throw new Error('Ticket not found or already closed.');
    }

    const settings = await TicketSettings.findOne({ guildID: guild.id });
    if (!settings || !settings.transcriptChannel) {
      throw new Error('Transcript channel is not set up.');
    }

    const transcriptChannel = guild.channels.cache.get(settings.transcriptChannel);
    if (!transcriptChannel) {
      throw new Error('Transcript channel is invalid.');
    }

    // Fetch the messages in the ticket channel to create a transcript
    const messages = await ticketChannel.messages.fetch();
    const transcript = messages.map((msg) => `${msg.author.tag}: ${msg.content}`).reverse().join('\n');

    const transcriptEmbed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle(`Ticket Closed: ${ticketChannel.name}`)
      .setDescription(`Ticket closed by ${member.user.tag}\n\n**Transcript:**\n${transcript}`);

    await transcriptChannel.send({ embeds: [transcriptEmbed] });

    // Mark the ticket as closed in the database
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    // Delete the ticket channel
    await ticketChannel.delete();
  },

  /**
   * Checks if a user is a ticket manager.
   * @param {GuildMember} member - The member whose role is being checked.
   * @param {Guild} guild - The guild where the ticket management is being performed.
   * @returns {Promise<boolean>} True if the member has a ticket manager role, false otherwise.
   */
  async isTicketManager(member, guild) {
    const settings = await TicketSettings.findOne({ guildID: guild.id });
    if (!settings || !settings.managerRoles || settings.managerRoles.length === 0) {
      return false;
    }

    return member.roles.cache.some((role) => settings.managerRoles.includes(role.id));
  },
};
