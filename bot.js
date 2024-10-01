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

// Initialize command collection
client.commands = new Collection();

// Listen to the messageCreate event to increment the message count
client.on('messageCreate', (message) => {
  if (!message.author.bot) {
    incrementMessageCount(); // Increment message count
  }
});

// Log and handle errors to prevent unhandled promise rejections
client.on('error', console.error);
client.on('shardError', (error) => {
  console.error(`Shard error: ${error.message}`);
});

// When a shard is ready, log a success message
client.on('shardReady', (shardID) => {
  console.log(`Shard ${shardID} is ready!`);
});

// Event listener when the bot is ready
client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

// Handle shard disconnects and log the reason
client.on('shardDisconnect', (event, shardID) => {
  console.log(`Shard ${shardID} disconnected: ${event.reason}`);
});

// Handle shard reconnect attempts
client.on('shardReconnecting', (shardID) => {
  console.log(`Shard ${shardID} is attempting to reconnect...`);
});

// Handle command interactions (Slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return interaction.reply({ content: 'Unknown command!', ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: 'There was an error executing this command!',
      ephemeral: true,
    });
  }
});

// Login the client and handle promise rejection
client.login(process.env.TOKEN).catch((error) => {
  console.error(`Failed to login: ${error.message}`);
});

module.exports = { client };
