const { Collection } = require('discord.js');

// In-memory storage for joinable roles (you could also use a database)
const joinableRoles = new Collection();

/**
 * Set a role as joinable.
 * @param {Guild} guild The Discord guild.
 * @param {Role} role The Discord role to set as joinable.
 */
function setJoinableRole(guild, role) {
    joinableRoles.set(guild.id, role.id);
}

/**
 * Get the joinable role for the guild.
 * @param {Guild} guild The Discord guild.
 * @returns {Role | null} The joinable role or null if none set.
 */
function getJoinableRole(guild) {
    return joinableRoles.get(guild.id) || null;
}

module.exports = { setJoinableRole, getJoinableRole };
