const { Player } = require('discord-player');
const { client } = require('../../index'); // Import the client

// Create a new player instance
const player = new Player(client);

// Optionally handle events (e.g., track start, queue end)
player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 Now playing **${track.title}**!`);
});

player.on('queueEnd', (queue) => {
  queue.metadata.channel.send('The queue has ended.');
});

module.exports = player;
