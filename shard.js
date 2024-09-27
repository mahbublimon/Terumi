const { ShardingManager } = require('discord.js');
require('dotenv').config();

// Initialize Sharding Manager
const manager = new ShardingManager('./bot.js', {
  token: process.env.TOKEN,
  totalShards: 'auto', // This will automatically determine the number of shards based on Discord's recommendations
});

// Spawn the shards
manager.spawn().catch((error) => {
  console.error('Error spawning shards:', error);
});

// Log shard creation
manager.on('shardCreate', shard => {
  console.log(`Shard ${shard.id} launched`);
});

// Handle shard death/restart events
manager.on('shardDeath', (shard) => {
  console.error(`Shard ${shard.id} has died.`);
});
