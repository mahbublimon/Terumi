const { SlashCommandBuilder } = require('discord.js');
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-channel')
    .setDescription('Set the ticket channel')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Channel where tickets will be created')
        .setRequired(true)
    ),
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
