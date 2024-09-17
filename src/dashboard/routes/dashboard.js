// Ensure express is only imported once
const express = require('express'); 
const router = express.Router();
const { client } = require('../../../bot'); // Import bot client from the correct path

// Initialize message tracking for messages per minute
let messageCount = 0;
let messagesPerMinute = 0;

// Track message creation events
client.on('messageCreate', () => {
  messageCount++;
});

// Reset message count every minute and calculate messages per minute
setInterval(() => {
  messagesPerMinute = messageCount;
  messageCount = 0;
}, 60000);

// API endpoint for bot statistics
router.get('/stats', (req, res) => {
  const uptimeInSeconds = Math.floor(client.uptime / 1000); // Convert milliseconds to seconds
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
    uptime: uptimeInSeconds // Send uptime in seconds
  });
});

module.exports = router;
