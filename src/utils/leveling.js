// src/utils/leveling.js
const User = require('../models/User');

// XP needed for the next level
const getRequiredXP = (level) => {
  return 5 * Math.pow(level, 2) + 50 * level + 100;
};

// Add experience to a user
async function addExperience(userID, guildID, amount) {
  let user = await User.findOne({ userID, guildID });
  if (!user) {
    user = await User.create({ userID, guildID });
  }

  user.experience += amount;

  // Check if user should level up
  let levelUp = false;
  while (user.experience >= getRequiredXP(user.level)) {
    user.experience -= getRequiredXP(user.level);
    user.level++;
    levelUp = true;
  }

  await user.save();
  return { levelUp, user };
}

module.exports = { addExperience, getRequiredXP };
