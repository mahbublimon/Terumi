const { SlashCommandBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close an existing ticket')
    .addStringOption(option => 
      option.setName('ticket-id')
        .setDescription('The ID of the ticket to close')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ticketId = interaction.options.getString('ticket-id');
    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
      return interaction.reply({ content: 'Ticket not found.', ephemeral: true });
    }

    // Close the ticket and archive it
    await Ticket.updateOne({ _id: ticketId }, { status: 'closed' });

    const ticketChannel = interaction.guild.channels.cache.get(ticket.channelId);
    if (ticketChannel) await ticketChannel.delete();

    await interaction.reply({ content: `Ticket #${ticketId} has been closed and archived.`, ephemeral: true });
  },
};
