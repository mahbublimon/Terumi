const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const SpotifyWebApi = require('spotify-web-api-node');
const { EmbedBuilder } = require('discord.js');

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('Spotify access token refreshed successfully');
  } catch (error) {
    console.error('Error retrieving Spotify access token', error);
  }
};

// Refresh token every hour
setInterval(refreshSpotifyToken, 3600 * 1000);
refreshSpotifyToken();

let clientInstance; // To hold the Discord client instance

// Initialize music player with the client
function initializePlayer(client) {
  clientInstance = client;
}

async function playSpotifyTrack(interaction, trackUrl) {
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
  const resource = createAudioResource(trackUrl);

  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });

  return interaction.reply({ content: '🎶 Now playing your Spotify track!' });
}

async function searchSpotifyTrack(query) {
  try {
    const result = await spotifyApi.searchTracks(query);
    return result.body.tracks.items[0];
  } catch (error) {
    console.error('Error searching Spotify track:', error);
    return null;
  }
}

module.exports = {
  initializePlayer,
  searchSpotifyTrack,
  playSpotifyTrack,
};
