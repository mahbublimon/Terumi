const { Player } = require('discord-player');
const { client } = require('../../index'); // Adjust path to where you initialize the Discord client

// Create a new Player instance
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  }
});

// Handle music events
player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 Now playing: **${track.title}**`);
});

player.on('queueEnd', (queue) => {
  queue.metadata.channel.send('The queue has ended.');
});

module.exports = player;
