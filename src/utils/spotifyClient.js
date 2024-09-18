const SpotifyWebApi = require('spotify-web-api-node');

// Create Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Function to refresh Spotify token
const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('Spotify access token refreshed');
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
  }
};

// Function to search for a track on Spotify
const searchSpotifyTrack = async (query) => {
  try {
    const result = await spotifyApi.searchTracks(query);
    const track = result.body.tracks.items[0];
    return track || null; // Return the track if found
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};

// Refresh token every hour
setInterval(refreshSpotifyToken, 3600 * 1000);
refreshSpotifyToken(); // Refresh on startup

module.exports = { searchSpotifyTrack, refreshSpotifyToken };
