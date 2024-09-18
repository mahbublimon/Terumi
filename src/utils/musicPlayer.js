  const player = createAudioPlayer();
  const resource = createAudioResource(trackUrl);
  const resource = createAudioResource(trackUrl); // Track URL from Spotify (e.g., preview URL)

  player.play(resource);
  connection.subscribe(player);

  try {
    await interaction.reply(`Playing track: ${trackUrl}`);
    await interaction.reply(`Now playing: ${trackUrl}`);
  } catch (err) {
    console.error('Error replying to interaction:', err.message);
  }

  // Ensure the player doesn't disconnect immediately
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The track is now playing!');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('Finished playing, disconnecting...');
    connection.destroy(); // Disconnect after the track finishes
    connection.destroy(); // Leave when done
  });

  player.on('error', error => {
    console.error('Error playing the track:', error);
    connection.destroy(); // Ensure we leave the channel on error
    connection.destroy(); // Disconnect on error
    if (!interaction.replied) {
      interaction.reply({ content: 'There was an error playing the track!', ephemeral: true });
    }
  });
}
