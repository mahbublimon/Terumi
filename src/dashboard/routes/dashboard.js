const express = require('express');
const path = require('path');
const router = express.Router();
const { client } = require('../../../bot'); // Import bot client
const { getMessagesPerMinute } = require('../../utils/messageCounter'); // Import message counter utility

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/discord');
  }
  next();
};

// Serve profile page
router.get('/profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Serve bot stats
router.get('/stats', (req, res) => {
  try {
    const uptimeInSeconds = Math.floor(client.uptime / 1000); // Convert milliseconds to seconds
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const cachedUsers = client.users.cache.size;
    const totalChannels = client.channels.cache.size;
    const totalServers = client.guilds.cache.size;
    const messagesPerMinute = getMessagesPerMinute(); // Fetch messages per minute count

    res.json({
      servers: totalServers,
      users: totalUsers,
      cachedUsers: cachedUsers,
      channels: totalChannels,
      messagesPerMinute, // Use the calculated value here
      uptime: uptimeInSeconds,
    });
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

// API endpoint for fetching user profile
router.get('/api/profile', isAuthenticated, (req, res) => {
  try {
    const user = req.session.user;
    const guilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id));

    res.json({
      username: user.username,
      userId: user.id,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      language: user.language || 'en',
      guilds: guilds.map(guild => ({
        name: guild.name,
        id: guild.id,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to load profile data' });
  }
});

// API endpoint to reset user profile
router.post('/api/profile/reset', isAuthenticated, (req, res) => {
  req.session.user.language = 'en'; // Reset user language or preferences
  res.json({ message: 'Profile reset successfully' });
});

// API endpoint to wipe user data
router.post('/api/profile/wipe', isAuthenticated, (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Failed to wipe data' });
      res.json({ message: 'Data wiped successfully' });
    });
  } catch (error) {
    console.error('Error wiping user data:', error);
    res.status(500).json({ message: 'Failed to wipe data' });
  }
});

module.exports = router;
