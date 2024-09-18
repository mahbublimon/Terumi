const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playDl = require('play-dl'); // YouTube audio streaming with play-dl

// Play a full song using YouTube audio
async function playFullSong(interaction, track) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply('You need to be in a voice channel to play music.');
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  try {
    // Search for the song on YouTube using play-dl
    const searchQuery = `${track.name} by ${track.artists[0].name}`;
    const video = await playDl.search(searchQuery, { limit: 1, source: { youtube: 'video' } });

    if (video.length === 0) {
      throw new Error('No audio found for the track.');
    }

    // Stream the audio from YouTube
    const stream = await playDl.stream(video[0].url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The track is now playing!');
      interaction.editReply(`Now playing: **${track.name}** by **${track.artists.map(artist => artist.name).join(', ')}**.`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Disconnect when the track finishes
      console.log('Finished playing, disconnected from the voice channel.');
    });

    player.on('error', error => {
      console.error('Error playing the track:', error);
      interaction.editReply('There was an error playing the track.');
      connection.destroy();
    });
  } catch (error) {
    console.error('Error:', error);
    interaction.editReply(`Failed to play the track: ${error.message}`);
    connection.destroy();
  }
}

module.exports = { playFullSong };
