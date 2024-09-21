const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close an active support ticket'),

  async execute(interaction) {
    const channel = interaction.channel;

    // Fetch ticket from the database based on channel
    const ticket = await Ticket.findOne({ channelID: channel.id });
    
    if (!ticket) {
      return interaction.reply({ content: 'This is not a valid ticket channel.', ephemeral: true });
    }

    // Update the ticket status to 'closed'
    ticket.status = 'closed';
    await ticket.save();

    // Notify the channel that the ticket is closed
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Closed`)
      .setDescription('The ticket has been successfully closed.')
      .setColor('RED');

    await channel.send({ embeds: [embed] });

    // Optionally delete the channel
    setTimeout(() => {
      channel.delete();
    }, 60000);
  }
};
