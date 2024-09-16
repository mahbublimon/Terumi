const { Player } = require('discord-player'); // Import discord-player
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const spotifyApi = require('./spotifyClient'); // Spotify API for searching tracks

// Initialize player instance
module.exports = (client) => {
  const player = new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }
  });

  client.player = player; // Attach the player instance to the Discord client

  player.on('error', (queue, error) => {
    console.error(`Error in the player: ${error.message}`);
  });

  player.on('trackStart', (queue, track) => {
    queue.metadata.send(`🎶 Now playing **${track.title}**!`);
  });

  player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`🎶 Track **${track.title}** added to the queue!`);
  });

  player.on('botDisconnect', queue => {
    queue.metadata.send('Bot was disconnected from the voice channel.');
  });

  player.on('trackEnd', (queue) => {
    queue.metadata.send('The track has ended.');
  });

  return player;
};
