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

  // Listen for player events to manage state
  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Disconnect when the track ends
  });

  player.on('error', error => {
    console.error('Error playing the track:', error);
    connection.destroy(); // Ensure we leave the channel on error
  });
}

module.exports = { playSpotifyTrack };
