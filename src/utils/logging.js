export const logMessage = (client, message, logType) => {
  const logChannel = client.channels.cache.find(
    (channel) => channel.name === logType,
  );
  if (logChannel) logChannel.send(message);
};

export const logBan = (client, member) => {
  const logMessage = `${member.user.tag} was banned from the server.`;
  logMessage(client, logMessage, "ban-logs");
};

export const logMessageDelete = (client, message) => {
  const logMessage = `Message by ${message.author.tag} deleted in ${message.channel.name}: ${message.content}`;
  logMessage(client, logMessage, "message-logs");
};
