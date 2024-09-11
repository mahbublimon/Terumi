// src/commands/music/stop.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'stop',
    description: 'Stop the music and clear the queue',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music to stop!', ephemeral: true });
    }

    queue.destroy();
    return interaction.reply({ content: '🛑 Music stopped and queue cleared!' });
  },
};
