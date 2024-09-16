const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the current music queue'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing to shuffle!', ephemeral: true });
    }

    queue.shuffle();
    return interaction.reply({ content: '🔀 Queue shuffled!' });
  },
};
