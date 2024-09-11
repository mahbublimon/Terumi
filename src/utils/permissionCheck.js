// src/utils/permissionCheck.js
const ModerationRoles = require('../models/ModerationRoles');

async function hasModerationPermissions(member) {
  if (member.permissions.has('ADMINISTRATOR')) return true;

  const moderationRoles = await ModerationRoles.findOne({ guildID: member.guild.id });
  if (!moderationRoles) return false; // No roles set, deny permission

  // Check if the member has any of the allowed roles
  return member.roles.cache.some(role => moderationRoles.roles.includes(role.id));
}

module.exports = hasModerationPermissions;
