// src/commands/music/queue.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'queue',
    description: 'Show the current music queue',
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const tracks = queue.tracks.map((track, i) => `${i + 1}. **${track.title}** (${track.duration})`).join('\n');
    return interaction.reply({
      content: `🎶 **Current Queue**:\n${tracks}`,
    });
  },
};
