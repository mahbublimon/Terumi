// index.js

require('dotenv').config(); // Load environment variables
const { Client, GatewayIntentBits } = require('discord.js');
const connectDB = require('./database'); // Import database connection function
const express = require('express');
const path = require('path');

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

// Initialize Express App for Dashboard
const app = express();
const PORT = 3000; // Dashboard runs on this port

// Serve static files for the dashboard (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src/dashboard/public')));

// Import and use dashboard API routes
const dashboardRoutes = require('./src/dashboard/routes/dashboard');
app.use('/api', dashboardRoutes);

// Start the Express dashboard server
app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
});

// Connect to MongoDB using the `database.js` file
connectDB();

// Bot ready event
client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
  setPresence();
});

// Set bot presence (status message)
function setPresence() {
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
}

// Load commands and events dynamically
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

// Track number of messages per minute for dashboard stats
let messageCount = 0;

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  messageCount++; // Increment message count

  // Handle custom logic for leveling, commands, AFK status, etc.
  const prefix = '!'; // Define your bot command prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error('Error executing command:', error);
    message.reply('There was an error executing that command!');
  }
});

// Reset the message count every minute
setInterval(() => {
  messageCount = 0; // Reset message count every 60 seconds
}, 60000);

// Handle interaction commands dynamically
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

// Export the client and messageCount for use in the dashboard routes
module.exports = { client, messageCount };

// Log in to Discord using the bot token from .env
client.login(process.env.TOKEN);
