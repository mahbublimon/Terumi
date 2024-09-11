// index.js

require('dotenv').config(); // Load environment variables
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

// Initialize Discord Client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Initialize Express app for the dashboard
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS) for the dashboard
app.use(express.static(path.join(__dirname, 'src/dashboard/public')));

// Import and use dashboard API routes
const dashboardRoutes = require('./src/dashboard/routes/dashboard');
app.use('/api', dashboardRoutes);

// Start Express server for the dashboard
app.listen(PORT, () => {
  console.log(`Dashboard running on http://localhost:${PORT}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Bot ready event
client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
  setPresence();
});

// Function to set bot presence/status
function setPresence() {
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
}

// Dynamic loading of commands and event handlers
const fs = require('fs');

// Load command files dynamically
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
client.commands = new Map();

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load event files dynamically
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Message handler logic for tracking and leveling system
let messageCount = 0; // Track number of messages per minute

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  messageCount++; // Increment message count

  // Example: Handle message content for leveling, AFK checks, or other custom logic
  const prefix = '!'; // Define your bot command prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check if the command exists and execute it
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error('Error executing command:', error);
    message.reply('There was an error trying to execute that command!');
  }
});

// Reset the message count every minute for tracking messages per minute
setInterval(() => {
  messageCount = 0; // Reset message count
}, 60000);

// Function to handle bot commands dynamically
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing interaction command:', error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

// Export the client and messageCount for the dashboard routes
module.exports = { client, messageCount };

// Log in to Discord using the bot token from .env
client.login(process.env.TOKEN);
