require('dotenv').config(); // Load environment variables
const { client } = require('./bot'); // Import client from bot.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const connectDB = require('./database'); // Import the database connection function
const express = require('express');
const path = require('path');
const fs = require('fs');
const musicPlayer = require('./src/utils/musicPlayer'); // Import musicPlayer utility

// Initialize Express App for Dashboard
const app = express();
const PORT = process.env.PORT || 3000; // Set dynamic port based on environment

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

// Route for Premium Page
app.get('/premium', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dashboard/public/premium.html'));
});

// Route for Discord Authentication (You need to implement this fully)
app.get('/auth/discord', (req, res) => {
  res.redirect('https://discord.com/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identify');
});

// Connect to MongoDB using the `database.js` file
connectDB();

// Pass client to musicPlayer
musicPlayer(client); // Pass the client to the musicPlayer module

// Bot ready event
client.once('ready', async () => {
  console.log(`${client.user.tag} is online and ready!`);
  await registerSlashCommands();
  setPresence();
});

// Set bot presence (status message)
function setPresence() {
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
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
        client.commands.set(command.data.name, command);
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
