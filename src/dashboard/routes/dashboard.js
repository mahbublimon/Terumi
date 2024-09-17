const express = require('express');
const router = express.Router();
const { client } = require('../../../bot'); // Access bot client

// Track messages per minute
let messageCount = 0;
let messagesPerMinute = 0;

// Listen for messages and increment count
client.on('messageCreate', () => {
  messageCount++;
});

// Reset message count every minute
setInterval(() => {
  messagesPerMinute = messageCount;
  messageCount = 0;
}, 60000);

// API endpoint for bot statistics
router.get('/stats', (req, res) => {
  const uptime = client.uptime / 1000; // Convert to seconds
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const cachedUsers = client.users.cache.size;
  const totalChannels = client.channels.cache.size;
  const totalServers = client.guilds.cache.size;

  res.json({
    servers: totalServers,
    users: totalUsers,
    cachedUsers: cachedUsers,
    channels: totalChannels,
    messagesPerMinute: messagesPerMinute,
    uptime: uptime // This is in seconds
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { client } = require('../../../bot'); // Access bot client

// Track messages per minute
let messageCount = 0;
let messagesPerMinute = 0;

// Listen for messages and increment count
client.on('messageCreate', () => {
  messageCount++;
});

// Reset message count every minute
setInterval(() => {
  messagesPerMinute = messageCount;
  messageCount = 0;
}, 60000);

// API endpoint for bot statistics
router.get('/stats', (req, res) => {
  const uptime = client.uptime / 1000; // Convert to seconds
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const cachedUsers = client.users.cache.size;
  const totalChannels = client.channels.cache.size;
  const totalServers = client.guilds.cache.size;

  res.json({
    servers: totalServers,
    users: totalUsers,
    cachedUsers: cachedUsers,
    channels: totalChannels,
    messagesPerMinute: messagesPerMinute,
    uptime: uptime // This is in seconds
  });
});

module.exports = router;
