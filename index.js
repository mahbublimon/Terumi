require('dotenv').config(); // Load environment variables
const { Client, GatewayIntentBits, Collection } = require('discord.js'); // Import necessary Discord.js classes
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const connectDB = require('./database'); // Import the database connection function
const express = require('express');
const path = require('path');
const fs = require('fs'); // File system module
const axios = require('axios'); // For handling Discord OAuth2 token and user fetch
const session = require('express-session'); // For session management
const { Webhook } = require('@top-gg/sdk'); // Top.gg SDK for vote tracking
const { client } = require('./bot'); // Use the client exported from bot.js

// Initialize Express App for Dashboard and Top.gg Webhooks
const app = express();
const PORT = process.env.PORT || 3000;

// Top.gg webhook auth token from environment variables
const topggWebhook = new Webhook(process.env.TOPGG_WEBHOOK_AUTH); // Use the token from the .env file

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Serve static files for the dashboard (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src/dashboard/public')));

// Import and use dashboard API routes
const dashboardRoutes = require('./src/dashboard/routes/dashboard');
app.use('/api', dashboardRoutes);

// Start the Express dashboard server with error handling
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Error starting dashboard server: ${error.message}`);
  } else {
    console.log(`Dashboard running on port ${PORT}`);
  }
});

// Top.gg Webhook Endpoint for receiving votes
app.post('/topgg-webhook', topggWebhook.middleware(), async (req, res) => {
  const { user } = req.vote;

  const logChannelId = process.env.VOTE_LOG_CHANNEL_ID; // Log channel ID for storing votes
  const logChannel = client.channels.cache.get(logChannelId);

  if (!logChannel) {
    console.error('Log channel not found.');
    return res.status(500).send('Log channel not found.');
  }

  await logChannel.send(`User <@${user}> has voted for the bot! 🎉`);
  res.status(200).send('Vote registered.');
});

// Route for Premium Page
app.get('/premium', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dashboard/public/premium.html'));
});

// Route for Discord Authentication (OAuth2)
app.get('/auth/discord', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

  res.redirect(discordAuthUrl);
});

// Route for handling the Discord OAuth2 callback
app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenResponse.data;

    // Use access token to fetch user data
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data;

    // Store user data in session
    req.session.user = user;

    // Redirect user to dashboard or home page
    res.redirect('/dashboard'); // Redirect after successful login
  } catch (error) {
    console.error('Error during Discord OAuth2 callback:', error.message);
    res.status(500).send('Authentication failed');
  }
});

// Route to serve the dashboard page
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/discord'); // Redirect to login if not authenticated
  }

  res.send(`Welcome to your dashboard, ${req.session.user.username}!`);
});

// Route for logout
app.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/'); // Redirect to home page or login
  });
});

// Connect to MongoDB using the `database.js` file
connectDB();

// Bot ready event
client.once('ready', async () => {
  console.log(`${client.user.tag} is online and ready!`);
  await registerSlashCommands();
  setPresence();
});

// Set bot presence (status message)
function setPresence() {
  if (client.guilds.cache.size > 0) {
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
  } else {
    client.user.setActivity('Starting up...', { type: 'PLAYING' });
  }
}

// Register Slash Commands globally or for specific guilds
async function registerSlashCommands() {
  const commandFolders = fs.readdirSync('./src/commands');
  const commands = [];

  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./src/commands/${folder}/${file}`);

      // Ensure the command uses SlashCommandBuilder
      if (command.data && typeof command.data.toJSON === 'function' && command.execute) {
        client.commands.set(command.data.name, command); // Ensure commands are set into the collection
        commands.push(command.data.toJSON()); // Prepare for registration
        console.log(`Registered command: ${command.data.name}`);
      } else {
        console.error(`Command at ./src/commands/${folder}/${file} is missing "data" or "execute" property, or is not using SlashCommandBuilder.`);
      }
    }
  }

  // Use REST API to register the commands
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');

    if (process.env.GUILD_ID) {
      // If a GUILD_ID is provided, register commands for a specific guild
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
        { body: commands },
      );
    } else {
      // Register commands globally
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

// Log in to Discord using the bot token from .env
client.login(process.env.TOKEN).catch((error) => {
  console.error('Failed to login:', error.message);
});
