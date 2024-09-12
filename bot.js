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

// Message count for stats
let messageCount = 0;

client.commands = new Collection();

module.exports = { client, messageCount };
