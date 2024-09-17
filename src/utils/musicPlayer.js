const axios = require('axios');
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

// Search Spotify for a track
async function searchSpotifyTrack(query) {
  try {
    // Make a request to Spotify's API to search for the track
    const result = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}` },
      params: { q: query, type: 'track', limit: 1 }
    });
    const track = result.data.tracks.items[0];
    return track || null;
  } catch (error) {
    console.error('Error fetching track from Spotify:', error);
    return null;
  }
}

// Play the track in a voice channel
async function playSpotifyTrack(interaction, trackUrl) {
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    throw new Error('You must be in a voice channel to play music.');
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  // Stream the track from Spotify (using a preview URL for example)
  const resource = createAudioResource(trackUrl);
  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The track is now playing!');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy(); // Disconnect when the track ends
  });
}

module.exports = {
  searchSpotifyTrack,
  playSpotifyTrack
};
