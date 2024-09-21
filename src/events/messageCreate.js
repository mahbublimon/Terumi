let messageCount = 0;
let messagesPerMinute = 0;

// Listen for the 'messageCreate' event
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Increment message count for every message created
    messageCount++;
  },
};
