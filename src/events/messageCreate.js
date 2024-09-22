const { trackMessage } = require('../utils/messageCounter');
const { Collection } = require('discord.js');

// Anti-spam: Collection to store user message timestamps
const userMessageTimestamps = new Collection();
const spamCooldown = 5000; // 5 seconds between messages to avoid spam

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Track each message
    trackMessage();

    // --- Command Handling ---
    const prefix = process.env.PREFIX || '!'; // Use a prefix like '!'
    if (message.content.startsWith(prefix)) {
      const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = message.client.commands.get(commandName);

      if (command) {
        try {
          await command.execute(message, args);
        } catch (error) {
          console.error(`Error executing command ${commandName}:`, error);
          message.reply('There was an error executing that command.');
        }
      }
    }

    // --- Anti-Spam Logic ---
    const now = Date.now();
    const timestamps = userMessageTimestamps.get(message.author.id);
    
    if (timestamps && (now - timestamps < spamCooldown)) {
      // If the user is sending messages too fast, delete their message and warn them
      await message.delete();
      return message.channel.send(`${message.author}, you're sending messages too quickly. Please slow down!`).then(msg => {
        setTimeout(() => msg.delete(), 5000); // Automatically delete the warning after 5 seconds
      });
    }
    
    // Update the timestamp for the user's message
    userMessageTimestamps.set(message.author.id, now);

    // --- Keyword Detection ---
    const keywordResponses = {
      'hello': 'Hi there! 👋',
      'help': 'How can I assist you?'
      // Add more keywords and responses as needed
    };

    const lowerCaseContent = message.content.toLowerCase();
    Object.keys(keywordResponses).forEach(keyword => {
      if (lowerCaseContent.includes(keyword)) {
        message.reply(keywordResponses[keyword]);
      }
    });

    // --- Mention Handling ---
    if (message.mentions.has(message.client.user)) {
      return message.reply('Hello! How can I assist you?');
    }
  },
};
