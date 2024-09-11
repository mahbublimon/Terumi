const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');  // Add Express for the web dashboard
require('dotenv').config();

mongoose.set('strictQuery', true);  // This line suppresses the deprecation warning

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

client.slashCommands = new Collection();

// Load commands and events
const { loadCommands, loadEvents } = require('./src/utils/loader');
loadCommands(client);
loadEvents(client);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(console.error);

// Login bot
client.login(process.env.TOKEN);

// Set up Express server for dashboard (if applicable)
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Bot Dashboard is running');
});

// Start the dashboard server
app.listen(PORT, () => {
    console.log(`Dashboard running on port ${PORT}`);
});
