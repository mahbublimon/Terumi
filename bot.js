const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { incrementMessageCount } = require('./src/utils/messageCounter'); // Import the message counter

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
  // Ignore bot messages
  if (!message.author.bot) {
    incrementMessageCount(); // Increment message count
  }
});

// Initialize command collection
client.commands = new Collection();

// Export the client for use in other parts of the application
module.exports = { client };
