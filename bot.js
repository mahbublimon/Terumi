const { Client, GatewayIntentBits, Collection } = require('discord.js');

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

// Initialize command collection
client.commands = new Collection();

// Track message count for stats
let messageCount = 0;

// Export both the client and messageCount for use in other parts of the application
module.exports = { client, messageCount };
