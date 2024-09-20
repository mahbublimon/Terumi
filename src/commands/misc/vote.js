const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Get a link to vote for Terumi'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x800080) // Purple in hexadecimal (you can also use other colors like EmbedBuilder.Colors.Blue)
      .setTitle('Vote for Terumi')
      .setDescription('Support Terumi by voting for us! [Click here to vote](https://top.gg/bot/1282770910197190666/vote)')
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
