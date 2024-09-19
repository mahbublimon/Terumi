const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Get a link to vote for Terumi'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('PURPLE')
      .setTitle('Vote for Terumi')
      .setDescription('Support Terumi by voting for us! [Click here to vote](https://top.gg/bot/)')
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
