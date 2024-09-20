const JoinableRole = require('../models/JoinableRole');

/**
 * Set a role as joinable in the database.
 * @param {Guild} guild The Discord guild.
 * @param {Role} role The Discord role to set as joinable.
 */
async function setJoinableRole(guild, role) {
  try {
    // Update or create the joinable role for the guild
    await JoinableRole.findOneAndUpdate(
      { guildID: guild.id },
      { roleID: role.id },
      { upsert: true, new: true }
    );
    console.log(`Joinable role set for guild ${guild.id}: ${role.id}`);
  } catch (error) {
    console.error(`Error setting joinable role for guild ${guild.id}:`, error);
  }
}

/**
 * Get the joinable role for the guild from the database.
 * @param {Guild} guild The Discord guild.
 * @returns {Role | null} The joinable role or null if none set.
 */
async function getJoinableRole(guild) {
  try {
    const result = await JoinableRole.findOne({ guildID: guild.id });
    if (result) {
      return guild.roles.cache.get(result.roleID) || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching joinable role for guild ${guild.id}:`, error);
    return null;
  }
}

module.exports = { setJoinableRole, getJoinableRole };
