// src/events/client/messageCreate.js
const { addExperience } = require('../../utils/leveling');
const cooldowns = new Map(); // For cooldown tracking
const afkUsers = require('../../commands/fun/afk').afkUsers; // AFK users map

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return; // Ignore bot and DM messages

  // Check and remove AFK status if the user is AFK
  if (afkUsers.has(message.author.id)) {
    afkUsers.delete(message.author.id);
    await message.reply('Welcome back! Your AFK status has been removed.');
  }

  // Notify when AFK users are mentioned
  if (message.mentions.users.size) {
    message.mentions.users.forEach((user) => {
      if (afkUsers.has(user.id)) {
        const afkData = afkUsers.get(user.id);
        message.reply(`${user.username} is AFK: ${afkData.reason}`);
      }
    });
  }

  // Experience system with cooldown to prevent spam
  const cooldownTime = 60000; // 60 seconds cooldown
  const userCooldown = cooldowns.get(message.author.id);

  // Check if the user is on cooldown
  if (userCooldown && Date.now() - userCooldown < cooldownTime) return;

  try {
    // Add random experience (between 10 and 35)
    const randomXP = Math.floor(Math.random() * 25) + 10;
    const { levelUp, user } = await addExperience(message.author.id, message.guild.id, randomXP);

    // Announce the level up in the channel
    if (levelUp) {
      await message.channel.send(`${message.author}, congratulations! You've leveled up to level ${user.level}!`);
    }

    // Optional: Automatically assign roles based on level
    const roleRewards = {
      10: 'Veteran',
      20: 'Champion',
      30: 'Legend',
    };

    if (roleRewards[user.level]) {
      const role = message.guild.roles.cache.find(r => r.name === roleRewards[user.level]);
      if (role) {
        const member = message.guild.members.cache.get(message.author.id);
        if (member && !member.roles.cache.has(role.id)) {
          await member.roles.add(role);
          await message.channel.send(`${message.author} has been granted the **${role.name}** role!`);
        }
      }
    }
  } catch (error) {
    console.error('Error adding experience:', error);
  }

  // Set cooldown for this user
  cooldowns.set(message.author.id, Date.now());
};
