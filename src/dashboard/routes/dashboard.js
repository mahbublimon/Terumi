// src/dashboard/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { client } = require('../../index'); // Assuming client is exported from the main bot file

let messageCount = 0; // Variable to count messages

// Increment message count for every message received
client.on('messageCreate', () => {
  messageCount++;
});

// Calculate messages per minute
setInterval(() => {
  messageCount = 0; // Reset every minute
}, 60000);

// API endpoint for bot statistics
router.get('/api/stats', (req, res) => {
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
    messagesPerMinute: messageCount,
    uptime,
  });
});

module.exports = router;
