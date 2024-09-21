const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../models/Ticket'); // A Mongoose model to store ticket data

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket')
    .setDescription('Create a new support ticket'),

  async execute(interaction) {
    const user = interaction.user;

    // Create embed for ticket creation
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('Support Ticket')
      .setDescription('Click the button below to create a new ticket.');

    // Create buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create-ticket-button')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
