const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { incrementMessageCount } = require('./src/utils/messageCounter'); // Import the message counter
require('dotenv').config();

// Initialize Discord Client
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

// Catch and log errors to prevent unhandled promise rejections
client.on('error', console.error);
client.on('shardError', (error) => {
  console.error(`Shard error: ${error.message}`);
});

// When a shard is ready, log a success message
client.on('shardReady', (shardID) => {
  console.log(`Shard ${shardID} is ready!`);
});

// Initialize command collection
client.commands = new Collection();

client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

// Handle shard disconnects gracefully
client.on('shardDisconnect', (event, shardID) => {
  console.log(`Shard ${shardID} disconnected: ${event.reason}`);
});

// Login the client and handle promise rejection
client.login(process.env.TOKEN).catch((error) => {
  console.error(`Failed to login: ${error.message}`);
});

module.exports = { client };
