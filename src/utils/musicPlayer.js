const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

// Play a Spotify track in a voice channel
async function playSpotifyTrack(interaction, trackUrl) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) return interaction.reply('Join a voice channel first!');

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  const resource = createAudioResource(trackUrl);

  player.play(resource);
  connection.subscribe(player);

  // Reply to interaction
  try {
    await interaction.reply(`Playing track: ${trackUrl}`);
  } catch (err) {
    console.error('Error replying to interaction:', err.message);
  }

  // Ensure the player doesn't disconnect immediately
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The track is now playing!');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('Finished playing, disconnecting...');
    connection.destroy(); // Disconnect after the track finishes
  });

  player.on('error', error => {
    console.error('Error playing the track:', error);
    connection.destroy(); // Ensure we leave the channel on error
  });
}

module.exports = { playSpotifyTrack };
