const { Player } = require('discord-player'); // Import discord-player

module.exports = (client) => {
  const player = new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }
  });

  client.player = player; // Attach the player to the client

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

  return player; // Return player for YouTube or Spotify integration
};
