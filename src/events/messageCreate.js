const { trackMessage } = require('../utils/messageCounter');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (!message.author.bot) {
      trackMessage();
    }
  },
};
