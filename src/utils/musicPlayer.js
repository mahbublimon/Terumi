const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const SpotifyWebApi = require('spotify-web-api-node');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh Spotify token
const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
  } catch (error) {
    console.error('Error retrieving Spotify access token:', error);
  }
};
setInterval(refreshSpotifyToken, 3600 * 1000);
refreshSpotifyToken();

// Search track on Spotify
const searchSpotifyTrack = async (query) => {
  try {
    const result = await spotifyApi.searchTracks(query);
    if (result.body.tracks.items.length > 0) {
      return result.body.tracks.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching track from Spotify:', error);
    return null;
  }
};

// Play Spotify track in voice channel
const playSpotifyTrack = async (interaction, trackInfo) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
  }

  // Join the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: false, // Bot will hear the audio
  });

  // Create an audio player and resource
  const audioPlayer = createAudioPlayer();
  const trackUrl = trackInfo.external_urls.spotify;

  const resource = createAudioResource(trackUrl); // Need to handle conversion of Spotify URL to playable format

  connection.subscribe(audioPlayer);
  audioPlayer.play(resource);

  // Disconnect bot if audio ends
  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });

  // Handle connection state changes
  connection.on(VoiceConnectionStatus.Disconnected, () => {
    connection.destroy();
  });

  // Send "Now Playing" embed
  const embed = new EmbedBuilder()
    .setTitle('🎶 Now Playing')
    .setDescription(`**[${trackInfo.name}](${trackInfo.external_urls.spotify})** by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
    .setThumbnail(trackInfo.album.images[0].url)
    .setColor('#1DB954'); // Spotify green

  await interaction.reply({ embeds: [embed] });
};

module.exports = {
  searchSpotifyTrack,
  playSpotifyTrack,
};
