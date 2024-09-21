let messagesPerMinute = 0;
let messageCount = 0;

// Increment message count when a new message is created
function incrementMessageCount() {
  messageCount++;
}

// Reset message count every minute and calculate the MPM
function resetMessageCount() {
  messagesPerMinute = messageCount;
  messageCount = 0;
}

// Return the latest MPM value
function getMessagesPerMinute() {
  return messagesPerMinute;
}

module.exports = {
  incrementMessageCount,
  resetMessageCount,
  getMessagesPerMinute,
};
