// src/commands/server/say.js
const { MessageEmbed } = require('discord.js');

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

    const embed = new MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Message from Terumi')
      .setDescription(message)
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
};
