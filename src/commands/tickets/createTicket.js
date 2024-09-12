// src/commands/tickets/createTicket.js
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ticketHandler = require('../../utils/ticketHandler');

module.exports = {
  data: {
    name: 'create-ticket-message',
    description: 'Send the ticket creation message with buttons',
  },
  async execute(interaction) {
    const ticketRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle('PRIMARY')
    );

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Support Ticket')
      .setDescription('Click the button below to create a support ticket.');

    await interaction.channel.send({ embeds: [embed], components: [ticketRow] });
    return interaction.reply({ content: 'Ticket creation message sent!', ephemeral: true });
  },
};
