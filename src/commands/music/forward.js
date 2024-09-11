// src/commands/music/forward.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'forward',
    description: 'Fast forward the current song by a specified amount of seconds',
    options: [
      {
        name: 'seconds',
        type: 'INTEGER',
        description: 'The number of seconds to fast forward',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);
    const seconds = interaction.options.getInteger('seconds');

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const currentTime = queue.currentTime;
    const forwardTime = Math.min(currentTime + seconds * 1000, queue.current.durationMS);

    queue.seek(forwardTime);
    return interaction.reply({ content: `⏩ Fast-forwarded by ${seconds} seconds!` });
  },
};
