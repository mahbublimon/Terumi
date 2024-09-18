const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify or YouTube')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify/YouTube URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      // Search for the track
      console.log(`Searching for the track: ${query}`);
      const track = await searchSpotifyTrack(query);

      if (!track) {
        console.log(`No results found for: ${query}`);
        return interaction.reply(`No results found for "${query}"!`);
      }

      // Play the track in the voice channel
      console.log(`Attempting to play track: ${track.name}`);
      await playSpotifyTrack(interaction, track.preview_url || track.external_urls.spotify);

      // Notify the user
      console.log(`Now playing: ${track.name} by ${track.artists.map(a => a.name).join(', ')}`);
      await interaction.reply(`Now playing: **${track.name}** by ${track.artists.map(a => a.name).join(', ')}`);
    } catch (error) {
      console.error('Error playing track:', error);
      await interaction.reply('Error playing the track.');
    }
  },
};
