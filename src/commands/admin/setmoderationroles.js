// src/commands/admin/setmoderationroles.js
const ModerationRoles = require('../../models/ModerationRoles');

module.exports = {
  data: {
    name: 'setmoderationroles',
    description: 'Set roles allowed to use moderation commands',
    options: [
      {
        name: 'roles',
        type: 'ROLE',
        description: 'Roles allowed to moderate (multiple allowed)',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
    }

    const roles = interaction.options.getRole('roles');
    let moderationRoles = await ModerationRoles.findOne({ guildID: interaction.guild.id });

    if (!moderationRoles) {
      moderationRoles = new ModerationRoles({ guildID: interaction.guild.id, roles: [] });
    }

    // Add selected role to the allowed moderation roles
    moderationRoles.roles = [...new Set([...moderationRoles.roles, roles.id])]; // Avoid duplicates
    await moderationRoles.save();

    await interaction.reply(`Role ${roles.name} has been added to the moderation roles.`);
  },
};
