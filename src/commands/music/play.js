const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Use EmbedBuilder
const { playFullSong } = require('../../utils/musicPlayer');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify or YouTube')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)),
  
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply(`No results found for "${query}"!`);
    }

    try {
      await playFullSong(interaction, track);

      const embed = new EmbedBuilder()
        .setTitle('Now Playing')
        .setDescription(`**${track.title}**`)
        .setColor('#1DB954'); // Spotify color

      await interaction.followUp({ embeds: [embed] });

    } catch (error) {
      console.error('Error playing the track:', error);
      await interaction.reply('Error playing the track.');
    }
  },
};
