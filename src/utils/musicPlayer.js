const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { Player } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const spotifyApi = require('./spotifyClient'); // Spotify API for searching tracks

const musicPlayer = {};
const player = new Player(); // Instance of discord-player

// Function to play music
musicPlayer.play = async (interaction, trackUrl, trackInfo) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
  }

  // Join the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  // Handle connection errors or disconnects
  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // If the connection re-establishes itself, continue playing music.
    } catch (error) {
      connection.destroy(); // Disconnect from the voice channel
    }
  });

  const audioPlayer = createAudioPlayer(); // Create the audio player
  const resource = createAudioResource(trackUrl); // Create the audio resource from the track URL

  audioPlayer.play(resource); // Play the audio resource
  connection.subscribe(audioPlayer); // Subscribe the connection to the audio player

  // Handle when the track ends
  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Disconnect when the song ends
  });

  // Send "Now Playing" embed
  const playEmbed = new EmbedBuilder()
    .setTitle('🎶 Now Playing')
    .setDescription(`**[${trackInfo.name}](${trackInfo.external_urls.spotify})** by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
    .setThumbnail(trackInfo.album.images[0].url)
    .setColor('#1DB954'); // Spotify Green

  await interaction.reply({ embeds: [playEmbed] });
};

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

module.exports = musicPlayer;
