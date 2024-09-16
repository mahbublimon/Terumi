const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Player } = require('discord-player');
const spotifyApi = require('./spotifyClient'); // Spotify API for search
const { EmbedBuilder } = require('discord.js');

const musicPlayer = {};
const player = new Player(); // Player instance from discord-player

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

  const audioPlayer = createAudioPlayer();
  const resource = createAudioResource(trackUrl);

  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  audioPlayer.on(AudioPlayerStatus.Idle, () => connection.destroy());

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

module.exports = player; // Export player for YouTube usage
module.exports.spotifyPlayer = musicPlayer; // Export the Spotify-based player
