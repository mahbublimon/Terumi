const { incrementMessageCount } = require('../utils/messageCounter');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Increment the message count
    incrementMessageCount();
  },
};
