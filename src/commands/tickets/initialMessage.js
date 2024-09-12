// src/commands/tickets/initialMessage.js
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: {
    name: 'initial-message',
    description: 'Customize the first message in new tickets',
    options: [
      {
        name: 'message',
        type: 'STRING',
        description: 'The first message sent in a ticket',
        required: true,
      },
    ],
  },
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
