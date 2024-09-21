const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const { archiveTicket } = require('../../utils/ticketArchiver');
const { releaseSupport } = require('../../utils/autoAssign');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close an active ticket')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The ticket channel to close')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const ticket = await Ticket.findOne({ channelID: channel.id });

    if (!ticket) {
      return interaction.reply({ content: 'This is not a valid ticket channel.', ephemeral: true });
    }

    // Archive the ticket
    const messages = await channel.messages.fetch({ limit: 100 }); // Fetch the last 100 messages
    await archiveTicket(ticket._id, messages);

    // Update ticket status and release support
    ticket.status = 'closed';
    ticket.closedAt = Date.now();
    await ticket.save();
    await releaseSupport(ticket.supportID);

    // Notify the user
    const embed = new EmbedBuilder()
      .setColor('RED')
      .setTitle('Ticket Closed')
      .setDescription(`Ticket <#${channel.id}> has been closed.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    await channel.send({ embeds: [embed] });

    // Optionally, delete the channel after a delay
    setTimeout(() => {
      channel.delete().catch(console.error);
    }, 5000); // 5 seconds delay
  },
};
