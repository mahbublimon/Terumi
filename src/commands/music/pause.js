// src/commands/music/pause.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'pause',
    description: 'Pause the current song',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    queue.setPaused(true);
    return interaction.reply({ content: '⏸ Music paused!' });
  },
};
