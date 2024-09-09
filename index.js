import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import { setupDashboard } from './src/dashboard/dashboardAPI.js';  // Import dashboard API

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

// Bot statistics
let botStats = {
    serverCount: 0,
    userCount: 0,
    channelCount: 0,
    messageRate: 0, // Placeholder for future rate calculation
};

// Function to update bot statistics
const updateStats = () => {
    botStats.serverCount = client.guilds.cache.size;
    botStats.userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    botStats.channelCount = client.channels.cache.size;
};

// Bot ready event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    updateStats(); // Initial stats
    setInterval(updateStats, 15000); // Update every 15 seconds
});

// Track message rate (messages per minute)
let messageCount = 0;

client.on('messageCreate', (message) => {
    messageCount++;
});

setInterval(() => {
    botStats.messageRate = (messageCount / 60).toFixed(2);  // messages per second (can scale as per your need)
    messageCount = 0;
}, 60000);  // Reset the counter every 60 seconds

// Login the bot
client.login(process.env.BOT_TOKEN);

// Start the dashboard API to serve statistics
const app = express();
setupDashboard(app, botStats);  // Passing stats to dashboard API

const port = process.env.DASHBOARD_PORT || 3000;
app.listen(port, () => {
    console.log(`Dashboard running on port ${port}`);
});