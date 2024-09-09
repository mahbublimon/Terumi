const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadEvents } = require('./src/utils/loader');
const mongoose = require('mongoose');
require('dotenv').config();  // Loads .env file

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new Collection();
client.buttons = new Collection(); // To manage button interactions
client.slashCommands = new Collection();

// Load commands and events
loadCommands(client);  // Loads all commands from src/commands
loadEvents(client);    // Loads all events from src/events

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(console.error);

// Bot login
client.login(process.env.TOKEN);
