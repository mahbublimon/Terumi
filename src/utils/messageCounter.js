let messageCount = 0;
let lastResetTime = Date.now();

function trackMessage() {
  messageCount++;
}

function getMessagesPerMinute() {
  const now = Date.now();
  const elapsedMinutes = (now - lastResetTime) / 60000; // Convert milliseconds to minutes
  const messagesPerMinute = elapsedMinutes > 0 ? messageCount / elapsedMinutes : 0;

  // Reset the count and time every minute
  if (elapsedMinutes >= 1) {
    messageCount = 0;
    lastResetTime = now;
  }

  return Math.round(messagesPerMinute);
}

module.exports = { trackMessage, getMessagesPerMinute };
