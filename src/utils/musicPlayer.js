const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const spotifyApi = require('./spotifyClient'); // Import Spotify client

const musicPlayer = {};

// Function to search a track on Spotify
musicPlayer.searchSpotifyTrack = async (query) => {
  try {
    const result = await spotifyApi.searchTracks(query);
    const track = result.body.tracks.items[0];
    return track || null;
  } catch (error) {
    console.error('Error fetching track from Spotify:', error);
    return null;
  }
};

// Function to play a Spotify track in a voice channel
musicPlayer.playTrack = async (interaction, trackUrl, trackInfo) => {
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

  // Create the audio player
  const audioPlayer = createAudioPlayer();
  
  // Assume we have a way to convert Spotify track to playable URL, such as from a third-party service
  const resource = createAudioResource(trackUrl); // Replace this with a working stream URL
  
  // Play the audio resource
  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  // Set up an event listener for when the audio player finishes
  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Leave the voice channel when the song finishes
  });

  // Send "Now Playing" embed
  const embed = new EmbedBuilder()
    .setColor('#1DB954')
    .setTitle('🎶 Now Playing')
    .setDescription(`[${trackInfo.name}](${trackInfo.external_urls.spotify}) by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
    .setThumbnail(trackInfo.album.images[0].url);

  await interaction.reply({ embeds: [embed] });
};

module.exports = musicPlayer;
