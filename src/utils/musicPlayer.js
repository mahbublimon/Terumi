const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const axios = require('axios');

// Function to initialize the player
function initializePlayer(client) {
  const player = createAudioPlayer();

  // Play Spotify track
  async function playSpotifyTrack(interaction, trackUrl) {
    try {
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply('You need to be in a voice channel to play music!');
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Fetch the Spotify track's stream (using a preview URL or similar)
      const response = await axios.get(trackUrl, { responseType: 'stream' });

      // Ensure the response is a readable stream for discord.js/voice
      const resource = createAudioResource(response.data);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log('The track is now playing!');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy(); // Leave the voice channel when the track finishes
      });

      return interaction.reply('Playing your track!');
    } catch (error) {
      console.error('Error playing track:', error);
      return interaction.reply('There was an error playing the track!');
    }
  }

  return { playSpotifyTrack };
}

module.exports = { initializePlayer };
