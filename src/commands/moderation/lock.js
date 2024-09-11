// src/commands/moderation/lock.js
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: {
    name: 'lock',
    description: 'Lock a channel',
    options: [
      {
        name: 'channel',
        type: 'CHANNEL',
        description: 'Channel to lock',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: false });

    await interaction.reply(`${channel.name} has been locked.`);
  },
};
