const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or artist name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    
    // Search for the track on Spotify
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply(`No results found for "${query}"!`);
    }

    // Use the preview URL of the Spotify track to play the song
    const trackUrl = track.preview_url;

    if (!trackUrl) {
      return interaction.reply(`Sorry, no preview available for **${track.name}**.`);
    }

    // Play the track in the voice channel
    try {
      await playSpotifyTrack(interaction, trackUrl);
      await interaction.reply(`Now playing: **${track.name}** by ${track.artists.map(a => a.name).join(', ')}`);
    } catch (error) {
      console.error('Error executing play command:', error);
      interaction.reply('There was an error playing the track.');
    }
  },
};
