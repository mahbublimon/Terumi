const User = require('../models/User');
const LevelRoles = require('../models/LevelRoles');

// Add experience to a user and handle level-up rewards
async function addExperience(userID, guildID, amount, client) {
  let user = await User.findOne({ userID, guildID });
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

  // If the user levels up, assign roles based on the new level
  if (levelUp) {
    await assignLevelRoles(user, guildID, client);
  }

  return { levelUp, user };
}

// Calculate XP required to level up
function getRequiredXP(level) {
  return 5 * (level ** 2) + 50 * level + 100; // Example XP calculation
}

// Assign roles based on the user's level
async function assignLevelRoles(user, guildID, client) {
  const guild = client.guilds.cache.get(guildID);
  if (!guild) return;

  const member = guild.members.cache.get(user.userID);
  if (!member) return;

  const levelRoles = await LevelRoles.findOne({ guildID });
  if (!levelRoles) return;

  // Find roles the user qualifies for based on their level
  const rolesToAssign = levelRoles.levelRoles
    .filter(r => user.level >= r.level)
    .map(r => guild.roles.cache.get(r.roleID))
    .filter(role => role); // Filter out non-existing roles

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
