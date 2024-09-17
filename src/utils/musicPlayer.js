const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spotifyApi = require('./spotifyClient'); // Spotify API client should be initialized here

// Function to search for a Spotify track
async function searchSpotifyTrack(query) {
  try {
    const result = await spotifyApi.searchTracks(query, { limit: 1 });
    const track = result.body.tracks.items[0];
    return track || null;
  } catch (error) {
    console.error('Error fetching track from Spotify:', error);
    return null;
  }
}

// Function to play the Spotify track (using preview URL)
async function playSpotifyTrack(interaction, track) {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply('You need to be in a voice channel to play music!');
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  // Use the Spotify track's preview URL
  if (!track.preview_url) {
    return interaction.reply('Sorry, this track does not have a preview URL available.');
  }

  const resource = createAudioResource(track.preview_url); // Play the preview URL
  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log(`Now playing: ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`);
    interaction.reply(`Now playing: **${track.name}** by ${track.artists.map(artist => artist.name).join(', ')}`);
  });

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Disconnect when the track finishes
    console.log('Finished playing, disconnected from the voice channel.');
  });

  player.on('error', (error) => {
    console.error('Error playing audio:', error);
    interaction.reply('There was an error playing the track.');
    connection.destroy();
  });
}

// Initialize the music player with the Discord client
function initializePlayer(client) {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'play') {
      const query = interaction.options.getString('query');
      const track = await searchSpotifyTrack(query);

      if (!track) {
        return interaction.reply(`No results found for "${query}".`);
      }

      await playSpotifyTrack(interaction, track);
    }
  });
}

// Export the function to initialize the player
module.exports = { initializePlayer, searchSpotifyTrack, playSpotifyTrack };
