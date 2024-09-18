const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playDl = require('play-dl');

// Play a Spotify or YouTube track in a voice channel
async function playSpotifyTrack(interaction, query) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) return interaction.reply('Join a voice channel first!');

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  try {
    // Use play-dl to search for a track and get a stream
    const streamInfo = await playDl.stream(query); // Stream from Spotify or YouTube
    const resource = createAudioResource(streamInfo.stream, {
      inputType: streamInfo.type, // Correct input type for play-dl stream
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The track is now playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Leave voice channel when track ends
    });

    await interaction.reply(`Now playing: ${query}`);
  } catch (error) {
    console.error('Error playing track:', error);
    await interaction.reply('Error playing the track.');
  }
}

module.exports = { playSpotifyTrack };
