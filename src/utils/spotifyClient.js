const SpotifyWebApi = require('spotify-web-api-node');

// Create Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh token and search functions
const refreshSpotifyToken = async () => {
  // Handle Spotify token refresh
};

const searchSpotifyTrack = async (query) => {
  const result = await spotifyApi.searchTracks(query);
  return result.body.tracks.items[0];
};

module.exports = { refreshSpotifyToken, searchSpotifyTrack };
