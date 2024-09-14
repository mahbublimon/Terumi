const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket-message')
    .setDescription('Send the ticket creation message with buttons'),

  async execute(interaction) {
    const ticketRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor('BLUE')
      .setTitle('Support Ticket')
      .setDescription('Click the button below to create a support ticket.');

    await interaction.channel.send({ embeds: [embed], components: [ticketRow] });
    return interaction.reply({ content: 'Ticket creation message sent!', ephemeral: true });
  },
};
