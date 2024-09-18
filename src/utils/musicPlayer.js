const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require('some-streaming-package'); // Ensure you're using a package to stream audio, or implement fetching the preview URL correctly

// Play a Spotify track in a voice channel
async function playSpotifyTrack(interaction, trackUrl) {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
  }

  try {
    // Establish the voice connection
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();

    // Verify the trackUrl is valid before playing
    console.log(`Attempting to play track: ${trackUrl}`);

    // Check if the URL is valid and fetch the audio stream if necessary
    const audioUrl = await getAudioUrl(trackUrl); // Implement this if needed to get a valid audio stream
    const resource = createAudioResource(audioUrl); // Use the audio URL or stream

    // Play the resource and subscribe the connection to the player
    player.play(resource);
    connection.subscribe(player);

    // Reply to the interaction
    await interaction.reply({ content: `Now playing: ${trackUrl}` });

    // Handle when the audio player enters the "Idle" state (finished playing)
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Finished playing the track, disconnecting...');
      connection.destroy(); // Leave the channel when finished
    });

    // Handle errors with audio playback
    player.on('error', error => {
      console.error('Error occurred during playback:', error);
      connection.destroy(); // Disconnect on error
      interaction.followUp({ content: 'Error playing the track!', ephemeral: true });
    });

  } catch (error) {
    console.error('Error playing track:', error);
    if (!interaction.replied) {
      interaction.reply({ content: 'An error occurred while trying to play the track!', ephemeral: true });
    }
  }
}

module.exports = { playSpotifyTrack };
