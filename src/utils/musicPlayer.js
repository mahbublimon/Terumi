// musicPlayer.js
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

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

  player.on('idle', () => connection.destroy()); // Leave when done
}

module.exports = { playSpotifyTrack };
