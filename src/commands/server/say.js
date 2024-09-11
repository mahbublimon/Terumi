// src/commands/server/say.js
module.exports = {
  data: {
    name: 'say',
    description: 'Send a custom message as Terumi',
    options: [
      {
        name: 'message',
        type: 'STRING',
        description: 'The message to send',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.channel.send(message);

    return interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
};
