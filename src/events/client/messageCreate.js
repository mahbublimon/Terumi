// src/events/client/messageCreate.js
const { addExperience } = require('../../utils/leveling');
const cooldowns = new Set(); // To prevent message spam farming

module.exports = async (client, message) => {
  if (message.author.bot) return;

  // Check if the user is on cooldown (e.g., 60 seconds)
  if (cooldowns.has(message.author.id)) return;

  // Add experience
  const { levelUp, user } = await addExperience(message.author.id, message.guild.id, Math.floor(Math.random() * 25) + 10);

  if (levelUp) {
    message.channel.send(`${message.author}, congratulations! You've leveled up to level ${user.level}!`);
  }

  // Add user to cooldown
  cooldowns.add(message.author.id);
  setTimeout(() => cooldowns.delete(message.author.id), 60000); // 60 second cooldown
};
