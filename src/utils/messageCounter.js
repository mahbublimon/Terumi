let messagesPerMinute = 0;
let messageCount = 0;

// Increment message count when a new message is created
function incrementMessageCount() {
  messageCount++;
}

// Reset message count and calculate messages per minute
function resetMessageCount() {
  messagesPerMinute = messageCount;
  messageCount = 0;
}

// Get the current messages per minute
function getMessagesPerMinute() {
  return messagesPerMinute;
}

module.exports = {
  incrementMessageCount,
  resetMessageCount,
  getMessagesPerMinute,
};
