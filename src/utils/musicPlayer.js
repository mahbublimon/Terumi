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
  const resource = createAudioResource(trackUrl); // Track URL from Spotify (e.g., preview URL)

  player.play(resource);
  connection.subscribe(player);

  // Reply to interaction only once
  try {
    await interaction.reply(`Now playing: ${trackUrl}`);
  } catch (err) {
    console.error('Error replying to interaction:', err.message);
  }

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('Finished playing, disconnecting...');
    connection.destroy(); // Leave when done
  });

  player.on('error', error => {
    console.error('Error playing the track:', error);
    connection.destroy(); // Disconnect on error
    if (!interaction.replied) {
      interaction.reply({ content: 'There was an error playing the track!', ephemeral: true });
    }
  });
}

module.exports = { playSpotifyTrack };
