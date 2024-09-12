// src/commands/tickets/ticketChannel.js
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: {
    name: 'ticket-channel',
    description: 'Set the ticket channel',
    options: [
      {
        name: 'channel',
        type: 'CHANNEL',
        description: 'Channel where tickets will be created',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    let settings = await TicketSettings.findOne({ guildID: interaction.guild.id });
    if (!settings) {
      settings = new TicketSettings({ guildID: interaction.guild.id });
    }

    settings.ticketChannel = channel.id;
    await settings.save();

    return interaction.reply({ content: `The ticket creation channel has been set to **${channel.name}**.`, ephemeral: true });
  },
};
