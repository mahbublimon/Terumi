export default {
  name: "messageCreate",
  async execute(message, client) {
    if (client.afkMap.has(message.author.id)) {
      client.afkMap.delete(message.author.id);
      message.reply("Welcome back! Your AFK status has been removed.");
    }

    if (message.mentions.users.size) {
      const mentionedUser = message.mentions.users.first();
      if (client.afkMap.has(mentionedUser.id)) {
        const afkMessage = client.afkMap.get(mentionedUser.id);
        message.reply(`${mentionedUser.tag} is AFK: ${afkMessage}`);
      }
    }
  },
};
