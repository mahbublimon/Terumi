// src/commands/music/loop.js
const player = require('../../utils/musicPlayer');

module.exports = {
  data: {
    name: 'loop',
    description: 'Toggle loop mode for the current song or the entire queue',
    options: [
      {
        name: 'mode',
        type: 'STRING',
        description: 'Loop mode: track, queue, or off',
        required: true,
        choices: [
          { name: 'Track', value: 'track' },
          { name: 'Queue', value: 'queue' },
          { name: 'Off', value: 'off' },
        ],
      },
    ],
  },
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);
    const mode = interaction.options.getString('mode');

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    if (mode === 'track') {
      queue.setRepeatMode(1); // Repeat track
      return interaction.reply({ content: '🔂 Loop mode set to: Track' });
    } else if (mode === 'queue') {
      queue.setRepeatMode(2); // Repeat queue
      return interaction.reply({ content: '🔁 Loop mode set to: Queue' });
    } else {
      queue.setRepeatMode(0); // Disable loop
      return interaction.reply({ content: '🔁 Loop mode turned off' });
    }
  },
};
