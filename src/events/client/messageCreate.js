// src/events/client/messageCreate.js
const { addExperience } = require('../../utils/leveling');
const cooldowns = new Map(); // For cooldown tracking
const afkUsers = require('../../commands/fun/afk').afkUsers; // AFK users map

module.exports = async (client, message) => {
  // Ignore bot and DM messages
  if (message.author.bot || !message.guild) return;

  // Handle AFK Status Removal
  handleAfkStatus(message);

  // Notify if mentioned users are AFK
  notifyAfkMentions(message);

  // Handle experience gain with cooldown
  await handleExperienceGain(message, client);
};

// Remove AFK status if the user is AFK and sends a message
function handleAfkStatus(message) {
  if (afkUsers.has(message.author.id)) {
    afkUsers.delete(message.author.id);
    message.reply('Welcome back! Your AFK status has been removed.');
  }
}

// Notify if AFK users are mentioned in the message
function notifyAfkMentions(message) {
  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach((user) => {
      if (afkUsers.has(user.id)) {
        const afkData = afkUsers.get(user.id);
        message.reply(`${user.username} is AFK: ${afkData.reason}`);
      }
    });
  }
}

// Handle experience gain with cooldowns and role rewards
async function handleExperienceGain(message, client) {
  const cooldownTime = 60000; // 60 seconds cooldown
  const userCooldown = cooldowns.get(message.author.id);

  // Check if user is on cooldown
  if (userCooldown && Date.now() - userCooldown < cooldownTime) return;

  try {
    // Add random XP (between 10 and 35)
    const randomXP = Math.floor(Math.random() * 25) + 10;
    const { levelUp, user } = await addExperience(message.author.id, message.guild.id, randomXP);

    // If user leveled up, announce it
    if (levelUp) {
      await message.channel.send(`${message.author}, congratulations! You've leveled up to level ${user.level}!`);
      await assignLevelRole(message, user, client);
    }

  } catch (error) {
    console.error('Error adding experience:', error);
  }

  // Set cooldown for this user
  cooldowns.set(message.author.id, Date.now());
}

// Assign role rewards based on user level
async function assignLevelRole(message, user, client) {
  const roleRewards = {
    10: 'Veteran',
    20: 'Champion',
    30: 'Legend',
  };

  const roleName = roleRewards[user.level];
  if (!roleName) return; // No role reward for this level

  const role = message.guild.roles.cache.find(r => r.name === roleName);
  if (!role) return; // Role not found

  const member = message.guild.members.cache.get(message.author.id);
  if (member && !member.roles.cache.has(role.id)) {
    await member.roles.add(role);
    await message.channel.send(`${message.author} has been granted the **${role.name}** role!`);
  }
}
