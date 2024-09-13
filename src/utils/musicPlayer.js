const { Player } = require('discord-player');
const { client } = require('../bot'); // Correct path to the client

// Initialize the player with proper options
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25, // Adjusts buffer size to handle larger streams
  },
});

// Event: When a track starts playing
player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 Now playing: **${track.title}**`);
});

// Event: When the queue has ended
player.on('queueEnd', (queue) => {
  queue.metadata.channel.send('The queue has ended.');
});

module.exports = player;
