module.exports = async function autoAssign(guild) {
  const staffRole = guild.roles.cache.find(role => role.name === 'Support Team'); // Replace with your role name
  const onlineMembers = staffRole.members.filter(member => member.presence?.status === 'online');

  if (onlineMembers.size > 0) {
    return onlineMembers.random();
  } else {
    return staffRole.members.random(); // Assign to any member if no one is online
  }
};
