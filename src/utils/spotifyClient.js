const SpotifyWebApi = require('spotify-web-api-node');

// Create Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh token and search functions
const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('Spotify access token refreshed');
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
  }
};

// Search Spotify for a track
const searchSpotifyTrack = async (query) => {
  try {
    const result = await spotifyApi.searchTracks(query);
    const track = result.body.tracks.items[0];
    return track || null; // Return the track or null if not found
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null; // Return null on error
  }
};

// Refresh token periodically
setInterval(refreshSpotifyToken, 3600 * 1000); // Every hour
refreshSpotifyToken(); // Refresh on startup

module.exports = { refreshSpotifyToken, searchSpotifyTrack };
