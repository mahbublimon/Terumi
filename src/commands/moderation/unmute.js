// src/commands/moderation/unmute.js
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'unmute',
    description: 'Unmute a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to unmute',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole || !member.roles.cache.has(muteRole.id)) {
      return interaction.reply('User is not muted.');
    }

    await member.roles.remove(muteRole);
    await interaction.reply(`${user.username} has been unmuted.`);
  },
};
