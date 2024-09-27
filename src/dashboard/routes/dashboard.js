const express = require('express');
const path = require('path');
const router = express.Router();
const { client } = require('../../../bot'); // Discord bot client
const { getMessagesPerMinute } = require('../../utils/messageCounter'); // Utility for tracking messages

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/discord');
  next();
};

// Serve main dashboard page
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Serve user's servers
router.get('/api/profile', isAuthenticated, (req, res) => {
  const user = req.session.user;
  const guilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id));

  res.json({
    username: user.username,
    guilds: guilds.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
    })),
  });
});

// Add a route to display bot stats to the bot owner
router.get('/bot-status', isAuthenticated, async (req, res) => {
  const botOwnerID = 'YOUR_DISCORD_USER_ID'; // Replace with your Discord user ID

  if (req.session.user.id !== botOwnerID) {
    return res.status(403).send('Access denied');
  }

  // Fetch the bot's status
  const uptimeInSeconds = Math.floor(client.uptime / 1000);
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const cachedUsers = client.users.cache.size;
  const totalChannels = client.channels.cache.size;
  const totalServers = client.guilds.cache.size;
  const messagesPerMinute = getMessagesPerMinute(); // Make sure this utility exists

  // Respond with the bot statistics
  res.json({
    servers: totalServers,
    users: totalUsers,
    cachedUsers: cachedUsers,
    channels: totalChannels,
    messagesPerMinute,
    uptime: uptimeInSeconds,
  });
});

module.exports = router;
