let messageCount = 0;

// Increment the message count whenever a message is sent
function trackMessage() {
  messageCount++;
}

// Calculate messages per minute
function getMessagesPerMinute() {
  const messagesPerMinute = messageCount;
  messageCount = 0; // Reset the count every minute
  return messagesPerMinute;
}

// Reset the message count every 60 seconds
setInterval(() => {
  messageCount = 0;
}, 60000);

module.exports = { trackMessage, getMessagesPerMinute };
