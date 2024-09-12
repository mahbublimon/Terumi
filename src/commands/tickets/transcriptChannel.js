// src/commands/tickets/transcriptChannel.js
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: {
    name: 'transcript-channel',
    description: 'Set the transcript channel for closed tickets',
    options: [
      {
        name: 'channel',
        type: 'CHANNEL',
        description: 'Channel where transcripts will be logged',
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

    settings.transcriptChannel = channel.id;
    await settings.save();

    return interaction.reply({ content: `The transcript channel has been set to **${channel.name}**.`, ephemeral: true });
  },
};
