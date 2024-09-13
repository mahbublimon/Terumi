const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const lyricsFinder = require('lyrics-finder');
const player = require('../../utils/musicPlayer');
const { EmbedBuilder } = require('discord.js'); // For embed messages

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

    const lyricsEmbed = new EmbedBuilder()
      .setTitle(`Lyrics for ${currentTrack.title}`)
      .setDescription(lyrics)
      .setColor('BLUE');

    return interaction.reply({ embeds: [lyricsEmbed] });
  },
};
