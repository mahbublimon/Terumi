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

// Export the client for use in other parts of the application
module.exports = { client };
