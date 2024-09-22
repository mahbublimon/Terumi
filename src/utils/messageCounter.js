let messageCount = 0;
let messagesPerMinute = 0;

// Increment message count whenever a message is created
function incrementMessageCount() {
  messageCount++;
}

// Calculate messages per minute and reset the counter
function calculateMessagesPerMinute() {
  messagesPerMinute = messageCount;
  messageCount = 0; // Reset the message count every minute
}

// Get the current messages per minute value
function getMessagesPerMinute() {
  return messagesPerMinute;
}

// Set interval to calculate messages per minute every 60 seconds
setInterval(calculateMessagesPerMinute, 60000);

module.exports = {
  incrementMessageCount,
  getMessagesPerMinute,
};
