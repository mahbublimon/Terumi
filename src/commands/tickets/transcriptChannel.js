const { SlashCommandBuilder } = require('discord.js');
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript-channel')
    .setDescription('Set the transcript channel for closed tickets')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Channel where transcripts will be logged')
        .setRequired(true)
    ),
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
