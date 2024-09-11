// src/commands/music/shuffle.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'shuffle',
    description: 'Shuffle the current music queue',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    queue.shuffle();
    return interaction.reply({ content: '🔀 Queue shuffled!' });
  },
};
