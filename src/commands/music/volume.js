const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the volume of the music')
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('Volume level (1-100)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const volume = interaction.options.getInteger('level');
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    if (volume < 1 || volume > 100) {
      return interaction.reply({ content: 'Volume must be between 1 and 100!', ephemeral: true });
    }

    queue.setVolume(volume);
    return interaction.reply({ content: `🔊 Volume set to ${volume}%` });
  },
};
