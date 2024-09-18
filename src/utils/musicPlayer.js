const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const axios = require('axios');

// Play a Spotify track in a voice channel
async function playSpotifyTrack(interaction, trackUrl) {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply('You need to join a voice channel first!');
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  try {
    // Fetch the track preview (direct stream of the preview URL)
    const response = await axios.get(trackUrl, { responseType: 'stream' });
    const resource = createAudioResource(response.data);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Track is now playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Track finished, disconnecting...');
      connection.destroy();
    });

  } catch (error) {
    console.error('Error playing the track:', error);
    interaction.reply('There was an error playing the track.');
  }
}

module.exports = { playSpotifyTrack };
