// src/commands/music/resume.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'resume',
    description: 'Resume the paused song',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music to resume!', ephemeral: true });
    }

    queue.setPaused(false);
    return interaction.reply({ content: '▶️ Music resumed!' });
  },
};
