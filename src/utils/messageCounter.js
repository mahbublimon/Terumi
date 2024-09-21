let messagesPerMinute = 0;
let messageCount = 0;

function resetMessageCount() {
  // Calculate messages per minute
  messagesPerMinute = messageCount;

  // Reset the message count
  messageCount = 0;
}

function getMessagesPerMinute() {
  return messagesPerMinute;
}

module.exports = {
  resetMessageCount,
  getMessagesPerMinute,
};
