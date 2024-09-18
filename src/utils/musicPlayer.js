const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

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
    // Use YouTube for full-length song
    const searchQuery = `${track.name} by ${track.artists[0].name}`;
    
    // Fetch video info using ytdl-core
    const videoUrl = `https://www.youtube.com/watch?v=${track.id}`; // Adjust URL to match the YouTube ID you get from search results
    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    const resource = createAudioResource(stream);
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
