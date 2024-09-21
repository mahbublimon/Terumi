const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-status')
    .setDescription('Check the status of a ticket')
    .addStringOption(option =>
      option.setName('ticket-id')
        .setDescription('The ID of the ticket to check')
        .setRequired(true)
    ),
    
  async execute(interaction) {
    const ticketID = interaction.options.getString('ticket-id');
    const ticket = await Ticket.findById(ticketID);

    if (!ticket) {
      return interaction.reply({ content: 'Ticket not found.', ephemeral: true });
    }

    const status = ticket.status === 'open' ? '🟢 Open' : '🔴 Closed';
    const embed = new EmbedBuilder()
      .setColor(ticket.status === 'open' ? 'GREEN' : 'RED')
      .setTitle('Ticket Status')
      .setDescription(`Ticket ID: ${ticketID}\nStatus: ${status}\nAssigned Support: <@${ticket.supportID}>\nIssue: ${ticket.issue}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
