require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const session = require('express-session');
const { Webhook } = require('@top-gg/sdk');
const { client } = require('./bot'); // Import bot.js
const connectDB = require('./database'); // Import database connection

// Initialize Express App for Dashboard and Top.gg Webhooks
const app = express();
const PORT = process.env.PORT || 3000;

// Top.gg webhook auth token from environment variables
const topggWebhook = new Webhook(process.env.TOPGG_WEBHOOK_AUTH);

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src/dashboard/public')));

// Import and use dashboard API routes
const dashboardRoutes = require('./src/dashboard/routes/dashboard');
app.use('/', dashboardRoutes); // Main router for all endpoints

// Start the server
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});

// Top.gg Webhook Endpoint for receiving votes
app.post('/topgg-webhook', topggWebhook.middleware(), async (req, res) => {
  const { user } = req.vote;
  const logChannelId = process.env.VOTE_LOG_CHANNEL_ID;
  const logChannel = client.channels.cache.get(logChannelId);

  if (!logChannel) {
    console.error('Log channel not found.');
    return res.status(500).send('Log channel not found.');
  }

  await logChannel.send(`User <@${user}> has voted for the bot! 🎉`);
  res.status(200).send('Vote registered.');
});

// Connect to MongoDB
connectDB();

// Bot ready event
client.once('ready', async () => {
  console.log(`${client.user.tag} is online and ready!`);
  await registerSlashCommands();
  setPresence();
});

// Set bot presence
function setPresence() {
  if (client.guilds.cache.size > 0) {
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
  } else {
    client.user.setActivity('Starting up...', { type: 'PLAYING' });
  }
}

// Register slash commands globally
async function registerSlashCommands() {
  const commandFolders = fs.readdirSync('./src/commands');
  const commands = [];
  const commandNames = new Set();

  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./src/commands/${folder}/${file}`);

      if (command.data && typeof command.data.toJSON === 'function' && command.execute) {
        if (commandNames.has(command.data.name)) {
          console.error(`Duplicate command name found: ${command.data.name}. Command will not be registered.`);
        } else {
          client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
          commandNames.add(command.data.name);
          console.log(`Registered command: ${command.data.name}`);
        }
      } else {
        console.error(`Command at ./src/commands/${folder}/${file} is missing "data" or "execute" property.`);
      }
    }
  }

  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
        { body: commands },
      );
    } else {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
      );
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

// Handle interaction commands dynamically
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: 'Unknown command!', ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing interaction command:', error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

// Log in to Discord
client.login(process.env.TOKEN).catch((error) => {
  console.error('Failed to login:', error.message);
});
