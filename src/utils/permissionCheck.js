const ModerationRoles = require('../models/ModerationRoles');

async function hasModerationPermissions(member) {
  // Grant permission if the member is an administrator
  if (member.permissions.has('ADMINISTRATOR')) return true;

  // Fetch the roles that have moderation permissions
  const moderationRoles = await ModerationRoles.findOne({ guildID: member.guild.id });
  if (!moderationRoles) return false; // If no moderation roles are set, deny permission

  // Check if the member has any of the allowed roles
  return member.roles.cache.some(role => moderationRoles.roles.includes(role.id));
}

module.exports = hasModerationPermissions;
