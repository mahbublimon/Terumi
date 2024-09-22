const { trackMessage } = require('../utils/messageCounter');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return; // Ignore bot messages

    trackMessage(); // Track each message
  },
};
