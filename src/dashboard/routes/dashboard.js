const express = require('express');
const router = express.Router();
const { client } = require('../../../index'); // Access bot client

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
    cachedUsers,
    channels: totalChannels,
    uptime
  });
});

module.exports = router;
