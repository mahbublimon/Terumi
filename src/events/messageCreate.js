const { trackMessage } = require('../utils/messageCounter'); // For tracking messages
const { afkUsers } = require('../commands/fun/afk'); // For handling AFK users

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages and direct messages
    if (!message.guild || message.author.bot) return;

    const member = message.member;

    // Track messages per minute (message counter functionality)
    trackMessage(); 

    // Handle AFK removal if the message author is AFK
    const afkStatus = afkUsers.get(member.id);

    if (afkStatus) {
      // Remove AFK status when the user sends a message
      afkUsers.delete(member.id);

      // Restore the original nickname
      const originalNickname = member.user.username;
      try {
        await member.setNickname(originalNickname, 'Removed AFK status');
        await member.setPresence({ status: 'online' }); // Reset user's status to online
        await message.reply(`Welcome back, ${originalNickname}! I've removed your AFK status.`);
      } catch (error) {
        console.error('Error removing AFK:', error);
      }
    }

    // Notify if the message mentions any AFK users
    message.mentions.members.forEach(mentionedMember => {
      if (afkUsers.has(mentionedMember.id)) {
        const afkInfo = afkUsers.get(mentionedMember.id);
        message.reply(`${mentionedMember.user.username} is currently AFK: ${afkInfo.reason}`);
      }
    });
  }
};
