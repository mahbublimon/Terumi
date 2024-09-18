const SpotifyWebApi = require('spotify-web-api-node');

// Create Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh token function
const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('Spotify access token refreshed');
  } catch (error) {
    console.error('Error refreshing Spotify token:', error.message);
  }
};

// Search Spotify for a track
const searchSpotifyTrack = async (query) => {
  try {
    // Ensure the token is still valid before searching
    if (!spotifyApi.getAccessToken()) {
      console.log('Access token missing, refreshing token...');
      await refreshSpotifyToken();
    }

    const result = await spotifyApi.searchTracks(query);

    // Handle no results case
    if (!result.body.tracks.items.length) {
      console.log(`No tracks found for query: ${query}`);
      return null;
    }

    const track = result.body.tracks.items[0];
    return track; // Return the first matching track
  } catch (error) {
    console.error('Error searching Spotify:', error.message);
    return null; // Return null on error
  }
};

// Refresh token periodically (every hour)
setInterval(refreshSpotifyToken, 3600 * 1000);
refreshSpotifyToken(); // Refresh the token on startup

module.exports = { refreshSpotifyToken, searchSpotifyTrack };
