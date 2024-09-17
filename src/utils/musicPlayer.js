const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spotifyApi = require('./spotifyClient'); // Spotify API client should be initialized here

// Play the track in a voice channel
async function playSpotifyTrack(interaction, trackUrl) {
  const voiceChannel = interaction.member.voice.channel;

  // Check if the user is in a voice channel
  if (!voiceChannel) {
    if (!interaction.replied) {
      return interaction.reply('You must be in a voice channel to play music.');
    }
    return;
  }

  // Join the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  // Create an audio resource for the Spotify track
  const resource = createAudioResource(trackUrl);
  player.play(resource);
  connection.subscribe(player);

  // Reply to the interaction only once
  try {
    if (!interaction.replied) {
      await interaction.reply({ content: `Playing track: ${trackUrl}` });
    }
  } catch (err) {
    console.error('Error replying to interaction:', err.message);
  }

  // Event listener when the track starts playing
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The track is now playing!');
  });

  // Event listener when the track finishes or goes idle
  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Disconnect from the voice channel
    console.log('Track finished playing, connection destroyed.');
  });

  // Error handling to avoid multiple replies
  player.on('error', async (error) => {
    console.error('Error playing the track:', error);

    // Reply with an error message only if no reply has been sent yet
    if (!interaction.replied) {
      try {
        await interaction.reply({ content: 'There was an error playing the track!', ephemeral: true });
      } catch (replyError) {
        console.error('Error sending error reply:', replyError.message);
      }
    }
  });
}

module.exports = {
  playSpotifyTrack,
};
