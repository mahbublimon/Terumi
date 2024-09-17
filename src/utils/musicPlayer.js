const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');

// Set up the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh the access token for Spotify every hour
const refreshToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify access token refreshed.');
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
  }
};

// Call the refreshToken function on startup and set an interval to refresh it every hour
refreshToken();
setInterval(refreshToken, 3600 * 1000);

// Search for a track on Spotify
async function searchSpotifyTrack(query) {
  try {
    const response = await spotifyApi.searchTracks(query);
    const track = response.body.tracks.items[0];
    return track;
  } catch (error) {
    console.error('Error searching for track on Spotify:', error);
    return null;
  }
}

// Play a Spotify track in a voice channel
async function playSpotifyTrack(interaction, track) {
  const voiceChannel = interaction.member.voice.channel;
  
  if (!voiceChannel) {
    return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
  }

  // Join the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const audioPlayer = createAudioPlayer();

  try {
    const resource = createAudioResource(track.preview_url); // Using Spotify preview URL for playback
    audioPlayer.play(resource);
    connection.subscribe(audioPlayer);

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    const embed = new EmbedBuilder()
      .setTitle('Now Playing')
      .setDescription(`[${track.name}](${track.external_urls.spotify}) by ${track.artists.map(a => a.name).join(', ')}`)
      .setThumbnail(track.album.images[0].url)
      .setColor('#1DB954'); // Spotify green

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error playing track:', error);
    interaction.reply({ content: 'There was an error playing the track.', ephemeral: true });
  }
}

module.exports = {
  searchSpotifyTrack,
  playSpotifyTrack,
};
