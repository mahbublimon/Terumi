const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playDl = require('play-dl');

// Play a Spotify or YouTube track in a voice channel
async function playSpotifyTrack(interaction, query) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply('Join a voice channel first!');
  }

  // Connect to the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  try {
    console.log(`Attempting to stream the track: ${query}`);
    const streamInfo = await playDl.stream(query); // Fetch stream from Spotify or YouTube
    const resource = createAudioResource(streamInfo.stream, {
      inputType: streamInfo.type, // Use the correct input type
    });

    player.play(resource);
    connection.subscribe(player);

    // Player event listeners
    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The track is now playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Track ended, disconnecting from the channel.');
      connection.destroy(); // Leave voice channel when the track ends
    });
  } catch (error) {
    console.error('Error playing the track:', error.message);
    await interaction.reply('Error playing the track.');
  }
}

module.exports = { playSpotifyTrack };
