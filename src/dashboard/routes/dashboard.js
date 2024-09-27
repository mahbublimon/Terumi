const express = require('express');
const axios = require('axios');
const path = require('path'); // Import the path module
const router = express.Router();
const { client } = require('../../../bot'); // Import the bot client

// Discord OAuth2 login route
router.get('/auth/discord', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify guilds`;

  res.redirect(discordAuthUrl);
});

// Discord OAuth2 callback route
router.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenResponse.data;

    // Fetch user info from Discord API using the access token
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data;
    req.session.user = user; // Store user data in session

    res.redirect('/dashboard'); // Redirect to the dashboard after login
  } catch (error) {
    console.error('Error during Discord OAuth2 callback:', error.message);
    res.status(500).send('Authentication failed');
  }
});

// Logout route
router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Failed to log out');
    res.redirect('/');
  });
});

// Shard information and bot status route
router.get('/bot-status', async (req, res) => {
  const botOwnerID = process.env.BOT_OWNER_ID;

  // Check if the current user is the bot owner
  if (!req.session.user || req.session.user.id !== botOwnerID) {
    return res.status(403).send('Access denied');
  }

  try {
    const shards = client.ws.shards.map(shard => ({
      id: shard.id,
      status: shard.status,
      ping: shard.ping,
    }));

    // Check if the bot is online
    const isOnline = client.ws.status ===
