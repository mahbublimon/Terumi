const { Client, GatewayIntentBits, Collection, ShardingManager } = require('discord.js');
const { incrementMessageCount } = require('./src/utils/messageCounter'); // Import the message counter
require('dotenv').config();

// Initialize Sharding Manager
const manager = new ShardingManager('./bot.js', {
  token: process.env.TOKEN,
  totalShards: 'auto', // This will spawn the number of shards based on Discord's recommendation
});

// Spawn the shards
manager.spawn();

// Log when a shard is launched
manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`);
});

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Listen to the messageCreate event to increment the message count
client.on('messageCreate', (message) => {
  if (!message.author.bot) {
    incrementMessageCount(); // Increment message count
  }
});

// Initialize command collection
client.commands = new Collection();

client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

// Login the client
client.login(process.env.TOKEN);

module.exports = { client };
