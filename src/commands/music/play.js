const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack, playSpotifyTrack } = require('../../utils/musicPlayer');

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

    // Search for the track using the query
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply({ content: `No results found for "${query}"!`, ephemeral: true });
    }

    try {
      // Play the track in the voice channel
      await playSpotifyTrack(interaction, track.preview_url || track.external_urls.spotify);

      // Send a reply to let the user know the track is playing
      await interaction.reply({ content: `Now playing: **${track.name}** by ${track.artists.map(artist => artist.name).join(', ')}` });
    } catch (error) {
      console.error('Error playing track:', error);
      interaction.reply({ content: 'There was an error playing the track!', ephemeral: true });
    }
  },
};
