const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const { assignSupport, releaseSupport } = require('../../utils/autoAssign');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll-ticket')
    .setDescription('Reassign the ticket to a different support member')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The ticket channel to reroll')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const ticket = await Ticket.findOne({ channelID: channel.id });

    if (!ticket) {
      return interaction.reply({ content: 'This is not a valid ticket channel.', ephemeral: true });
    }

    // Release the previous support member
    await releaseSupport(ticket.supportID);

    // Assign a new support member
    let newSupport;
    try {
      newSupport = await assignSupport();
    } catch (error) {
      return interaction.reply({ content: 'No available support staff to reroll.', ephemeral: true });
    }

    // Update ticket with the new support member
    ticket.supportID = newSupport.userID;
    await ticket.save();

    // Notify about the reroll
    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Ticket Rerolled')
      .setDescription(`This ticket has been reassigned to <@${newSupport.userID}>.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    await channel.send({ embeds: [embed] });
  },
};
