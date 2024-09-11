// src/commands/music/skip.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'skip',
    description: 'Skip the current song',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    queue.skip();
    return interaction.reply({ content: '⏭ Song skipped!' });
  },
};
