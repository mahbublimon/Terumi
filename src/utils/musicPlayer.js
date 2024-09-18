const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playDl = require('play-dl');

// Play a Spotify track or YouTube video in a voice channel
async function playTrack(interaction, track) {
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
    let resource;

    // Use YouTube for full-length song (play-dl)
    const searchQuery = `${track.name} by ${track.artists[0].name}`;
    const video = await playDl.search(searchQuery, { limit: 1, source: { youtube: "video" } });

    if (video.length === 0) {
      throw new Error('No YouTube video found for the track.');
    }

    const stream = await playDl.stream(video[0].url);
    resource = createAudioResource(stream.stream, { inputType: stream.type });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Track is now playing!');
      interaction.reply(`Now playing: **${track.name}** by ${track.artists.map(artist => artist.name).join(', ')}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Leave when done
      console.log('Finished playing, disconnected from the voice channel.');
    });

    player.on('error', error => {
      console.error('Error playing the track:', error);
      connection.destroy();
    });

  } catch (error) {
    console.error('Error while playing the track:', error);
    await interaction.reply(`Failed to play the track: ${error.message}`);
  }
}

module.exports = { playTrack };
