const JoinableRole = require('../models/JoinableRole');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const guildID = member.guild.id;

    // Fetch the joinable role from the database
    const joinableRole = await JoinableRole.findOne({ guildID });

    if (joinableRole && joinableRole.roleID) {
      const role = member.guild.roles.cache.get(joinableRole.roleID);

      if (role) {
        // Assign the joinable role to the new member
        await member.roles.add(role);
        console.log(`Assigned role ${role.name} to new member ${member.user.tag}`);
      } else {
        console.error(`Role with ID ${joinableRole.roleID} not found in guild ${guildID}`);
      }
    }
  },
};
