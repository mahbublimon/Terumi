const { Player } = require('discord-player');
const { client } = require('../../index'); // Make sure the path to the client is correct

// Initialize the player with correct options
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  }
});

// Listen for track events
player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 Now playing: **${track.title}**`);
});

player.on('queueEnd', (queue) => {
  queue.metadata.channel.send('The queue has ended.');
});

module.exports = player;
