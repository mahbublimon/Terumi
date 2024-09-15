const express = require('express');
const router = express.Router();
const { client } = require('../../../bot'); // Access bot client

// API endpoint for bot statistics
router.get('/stats', (req, res) => {
  const uptime = process.uptime();
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const cachedUsers = client.users.cache.size;
  const totalChannels = client.channels.cache.size;
  const totalServers = client.guilds.cache.size;

  res.json({
    servers: totalServers,
    users: totalUsers,
    cachedUsers: cachedUsers,
    channels: totalChannels,
    messagesPerMinute: 0,  // Placeholder, you can implement message count tracking
    uptime: uptime
  });
});

module.exports = router;
