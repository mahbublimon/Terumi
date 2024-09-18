const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      // Defer the reply to allow time for the track search and preparation
      await interaction.deferReply();

      const track = await searchSpotifyTrack(query);
      if (!track) {
        return interaction.editReply(`No results found for "${query}"!`);
      }

      // Play the track in the voice channel
      await playSpotifyTrack(interaction, track.preview_url);

      // Edit the deferred reply with the success message
      await interaction.editReply(`Now playing: **${track.name}** by ${track.artists.map(a => a.name).join(', ')}`);
    } catch (error) {
      console.error('Error playing the track:', error);

      // Handle error if the interaction is already replied or deferred
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply('There was an error playing the track.');
      } else {
        await interaction.editReply('There was an error playing the track.');
      }
    }
  },
};
