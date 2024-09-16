const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Player } = require('discord-player'); // Import discord-player
const spotifyApi = require('./spotifyClient'); // Spotify API for search
const { EmbedBuilder } = require('discord.js');

// Initialize the Player instance from discord-player
module.exports = (client) => {
  const player = new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25, // Ensures better performance when streaming audio
    },
  });

  client.player = player; // Attach the player instance to the Discord client

  player.on('error', (queue, error) => {
    console.error(`Error in the player: ${error.message}`);
  });

  player.on('trackStart', (queue, track) => {
    queue.metadata.send(`🎶 Now playing **${track.title}**!`);
  });

  player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`🎶 Track **${track.title}** added to the queue!`);
  });

  player.on('botDisconnect', (queue) => {
    queue.metadata.send('Bot was disconnected from the voice channel.');
  });

  return player; // Return the player instance for handling YouTube and other sources
};

// Define the Spotify-based music player
const musicPlayer = {};

// Function to play a track from Spotify
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
  });

  // Create an audio player and resource
  const audioPlayer = createAudioPlayer();
  const resource = createAudioResource(trackUrl);

  // Play the resource
  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Leave the channel when the track ends
  });

  // Send the "Now Playing" embed message
  const playEmbed = new EmbedBuilder()
    .setTitle('🎶 Now Playing')
    .setDescription(`**[${trackInfo.name}](${trackInfo.external_urls.spotify})** by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
    .setThumbnail(trackInfo.album.images[0].url)
    .setColor('#1DB954'); // Spotify Green color

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

module.exports.spotifyPlayer = musicPlayer; // Export the Spotify player functions
