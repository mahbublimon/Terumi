const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spotifyApi = require('./spotifyApi'); // Assuming Spotify API is initialized in another module

// Initialize the music player with the Discord client
function initializePlayer(client) {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // Example of handling a 'play' command
    if (interaction.commandName === 'play') {
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
      const resource = createAudioResource('path/to/audio/file.mp3'); // Placeholder for the Spotify audio resource
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log('The audio is now playing!');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        console.log('Audio has finished playing, connection closed.');
      });
    }
  });
}

// Export the function to initialize the player
module.exports = { initializePlayer };
