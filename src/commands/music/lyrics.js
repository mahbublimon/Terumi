// src/commands/music/lyrics.js
const lyricsFinder = require('lyrics-finder');
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get the lyrics for the current song'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const currentTrack = queue.current;
    const lyrics = await lyricsFinder(currentTrack.author, currentTrack.title) || 'No lyrics found!';

    return interaction.reply({
      content: `**Lyrics for ${currentTrack.title}:**\n${lyrics}`,
    });
  },
};
