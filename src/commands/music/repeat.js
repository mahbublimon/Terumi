const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Toggle repeat mode for the current song or the entire queue')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Repeat mode: track, queue, or off')
        .setRequired(true)
        .addChoices(
          { name: 'Track', value: 'track' },
          { name: 'Queue', value: 'queue' },
          { name: 'Off', value: 'off' }
        )
    ),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);
    const mode = interaction.options.getString('mode');

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    if (mode === 'track') {
      queue.setRepeatMode(1); // Repeat track
      return interaction.reply({ content: '🔂 Repeat mode set to: Track' });
    } else if (mode === 'queue') {
      queue.setRepeatMode(2); // Repeat queue
      return interaction.reply({ content: '🔁 Repeat mode set to: Queue' });
    } else {
      queue.setRepeatMode(0); // Disable repeat
      return interaction.reply({ content: '🔁 Repeat mode turned off' });
    }
  },
};
