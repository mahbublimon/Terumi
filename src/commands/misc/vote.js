// src/commands/misc/vote.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'vote',
    description: 'Get a link to vote for Terumi',
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Vote for Terumi')
      .setDescription('Support Terumi by voting for us! [Click here to vote](https://top.gg/bot/your-bot-id)')
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
