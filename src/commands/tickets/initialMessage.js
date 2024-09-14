const { SlashCommandBuilder } = require('discord.js');
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('initial-message')
    .setDescription('Customize the first message in new tickets')
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The first message sent in a ticket')
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');

    let settings = await TicketSettings.findOne({ guildID: interaction.guild.id });
    if (!settings) {
      settings = new TicketSettings({ guildID: interaction.guild.id });
    }

    settings.initialMessage = message;
    await settings.save();

    return interaction.reply({ content: 'The initial ticket message has been updated.', ephemeral: true });
  },
};
