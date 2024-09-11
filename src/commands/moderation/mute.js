// src/commands/moderation/mute.js
const hasAdminPermissions = require('../../utils/permissionCheck');
const ms = require('ms'); // For time parsing

module.exports = {
  data: {
    name: 'mute',
    description: 'Mute a user for a specified duration',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to mute',
        required: true,
      },
      {
        name: 'duration',
        type: 'STRING',
        description: 'Duration of mute (e.g., 10m, 1h)',
        required: true,
      },
      {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for muting the user',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason');
    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole) {
      return interaction.reply('Mute role not found. Please create a role called "Muted".');
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (member.roles.cache.has(muteRole.id)) {
      return interaction.reply('User is already muted.');
    }

    await member.roles.add(muteRole);
    await interaction.reply(`${user.username} has been muted for ${duration}. Reason: ${reason}`);

    // Unmute after the specified duration
    setTimeout(async () => {
      if (member.roles.cache.has(muteRole.id)) {
        await member.roles.remove(muteRole);
        await member.send('You have been unmuted.');
      }
    }, ms(duration));
  },
};
