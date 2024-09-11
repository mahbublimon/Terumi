// src/commands/moderation/ban.js
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'ban',
    description: 'Ban a user from the server',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to ban',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for banning the user',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = interaction.guild.members.cache.get(user.id);

    await member.ban({ reason });
    await interaction.reply(`${user.username} has been banned. Reason: ${reason}`);
  },
};
