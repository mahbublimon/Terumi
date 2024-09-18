const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core'); // Switch to ytdl-core for YouTube

// Play a Spotify track or YouTube video in a voice channel
async function playFullSong(interaction, track) {
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
    // Stream the YouTube video using ytdl-core
    const stream = ytdl(track.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Track is now playing!');
      interaction.followUp(`Now playing: **${track.title}**`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Leave when the song ends
    });

  } catch (error) {
    console.error('Error playing the track:', error);
    await interaction.reply('Error playing the track.');
  }
}

module.exports = { playFullSong };
