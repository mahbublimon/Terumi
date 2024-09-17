const SpotifyWebApi = require('spotify-web-api-node');

// Create Spotify client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('Spotify access token refreshed');
  } catch (error) {
    console.error('Error retrieving Spotify access token:', error);
  }
};

// Refresh token every hour
setInterval(refreshSpotifyToken, 3600 * 1000);
refreshSpotifyToken();

module.exports = spotifyApi;
