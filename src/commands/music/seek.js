const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a specific timestamp in the song')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('The timestamp to seek to (e.g., 2:36)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);
    const time = interaction.options.getString('time');

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const [minutes, seconds] = time.split(':').map(Number);
    const seekTime = minutes * 60 + seconds;

    queue.seek(seekTime * 1000); // Seek in milliseconds
    return interaction.reply({ content: `⏩ Seeked to ${time}` });
  },
};
