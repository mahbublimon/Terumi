const { SlashCommandBuilder } = require('@discordjs/builders');
const musicPlayer = require('../../utils/musicPlayer'); // Import musicPlayer utility

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The name of the song or artist to play')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    
    // Search for the track on Spotify
    const track = await musicPlayer.searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply({ content: `No results found for "${query}".`, ephemeral: true });
    }

    // For simplicity, we assume that the Spotify track URL can be used as the stream URL
    const trackUrl = track.external_urls.spotify;

    // Play the track in the voice channel
    try {
      await musicPlayer.playTrack(interaction, trackUrl, track);
    } catch (error) {
      console.error('Error playing music:', error);
      return interaction.reply({ content: 'There was an error playing the music.', ephemeral: true });
    }
  },
};
