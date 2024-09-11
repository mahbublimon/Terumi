// src/utils/leveling.js
const LevelRoles = require('../models/LevelRoles');

// Add experience to a user and handle level-up rewards
async function addExperience(userID, guildID, amount) {
  const user = await User.findOne({ userID, guildID });
  if (!user) {
    user = new User({ userID, guildID });
  }

  user.experience += amount;
  let levelUp = false;

  // Check if the user should level up
  while (user.experience >= getRequiredXP(user.level)) {
    user.experience -= getRequiredXP(user.level);
    user.level++;
    levelUp = true;
  }

  await user.save();

  if (levelUp) {
    await assignLevelRoles(user, guildID);
  }

  return { levelUp, user };
}

// Assign roles based on the user's level
async function assignLevelRoles(user, guildID) {
  const guild = client.guilds.cache.get(guildID);
  const member = guild.members.cache.get(user.userID);
  const levelRoles = await LevelRoles.findOne({ guildID });

  if (!levelRoles) return;

  // Find the roles the user qualifies for based on their level
  const rolesToAssign = levelRoles.levelRoles
    .filter(r => user.level >= r.level)
    .map(r => guild.roles.cache.get(r.roleID))
    .filter(role => role); // Filter out any roles that no longer exist

  if (levelRoles.stackRoles) {
    // Stack roles: assign all roles the user qualifies for
    for (const role of rolesToAssign) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
      }
    }
  } else {
    // Replace roles: assign only the highest-level role and remove previous ones
    const highestRole = rolesToAssign[rolesToAssign.length - 1];
    if (highestRole && !member.roles.cache.has(highestRole.id)) {
      await member.roles.add(highestRole);
    }

    // Remove any lower-level roles the user has
    for (const role of member.roles.cache.values()) {
      if (rolesToAssign.includes(role) && role !== highestRole) {
        await member.roles.remove(role);
      }
    }
  }
}

module.exports = { addExperience, getRequiredXP };
