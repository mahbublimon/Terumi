// src/utils/permissionCheck.js
module.exports = function hasAdminPermissions(member) {
  // Check if the user has the "Administrator" permission or specific roles (like 'Admin', 'Moderator')
  return (
    member.permissions.has('ADMINISTRATOR') || 
    member.roles.cache.some(role => ['Admin', 'Moderator'].includes(role.name))
  );
};
