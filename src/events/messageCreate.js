const { trackMessage } = require('../utils/messageCounter'); // For tracking messages
const { afkUsers } = require('../commands/fun/afk'); // For handling AFK users

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages and non-guild messages (DMs)
    if (!message.guild || message.author.bot) return;

    const member = message.member;

    // Track messages per minute (message counter functionality)
    trackMessage();

    // Check if the message author is AFK and remove their AFK status
    const afkStatus = afkUsers.get(member.id);

    if (afkStatus) {
      // Remove AFK status when the user sends a message
      afkUsers.delete(member.id);

      // Notify the user that their AFK status has been removed
      try {
        await message.reply(`Welcome back, ${member.user.username}! Your AFK status has been removed.`);
      } catch (error) {
        console.error('Error removing AFK status:', error);
      }
    }

    // Check if the message mentions any AFK users
    message.mentions.members.forEach(mentionedMember => {
      if (afkUsers.has(mentionedMember.id)) {
        const afkInfo = afkUsers.get(mentionedMember.id);
        message.reply(`${mentionedMember.user.username} is currently AFK: ${afkInfo.reason}`);
      }
    });
  }
};
