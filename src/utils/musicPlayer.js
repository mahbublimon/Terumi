const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

async function playFullSong(interaction, trackUrl) {
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

  try {
    // Create the stream with error handling
    const stream = ytdl(trackUrl, {
      filter: 'audioonly', // Ensure it's only the audio
      quality: 'highestaudio', // Ensure it's the highest quality available
      highWaterMark: 1 << 25, // Increase buffer size if needed
    });

    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Track is now playing!');
      interaction.followUp('Track is now playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      console.log('Finished playing.');
    });

  } catch (error) {
    console.error('Error playing the track:', error);
    await interaction.reply('Error playing the track.');
  }
}

module.exports = { playFullSong };
