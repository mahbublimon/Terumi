// src/commands/admin/setlevelroles.js
const LevelRoles = require('../../models/LevelRoles');

module.exports = {
  data: {
    name: 'setlevelroles',
    description: 'Set role rewards for reaching specific levels',
    options: [
      {
        name: 'level',
        type: 'INTEGER',
        description: 'The level at which the role is assigned',
        required: true,
      },
      {
        name: 'role',
        type: 'ROLE',
        description: 'The role to be assigned at that level',
        required: true,
      },
      {
        name: 'stack_roles',
        type: 'BOOLEAN',
        description: 'Should roles stack (true) or not (false)',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
    }

    const level = interaction.options.getInteger('level');
    const role = interaction.options.getRole('role');
    const stackRoles = interaction.options.getBoolean('stack_roles');

    let levelRoles = await LevelRoles.findOne({ guildID: interaction.guild.id });

    if (!levelRoles) {
      levelRoles = new LevelRoles({ guildID: interaction.guild.id, levelRoles: [] });
    }

    // Update or add the level role
    const existingRole = levelRoles.levelRoles.find(r => r.level === level);
    if (existingRole) {
      existingRole.roleID = role.id;
    } else {
      levelRoles.levelRoles.push({ level, roleID: role.id });
    }

    if (stackRoles !== null) {
      levelRoles.stackRoles = stackRoles;
    }

    await levelRoles.save();

    await interaction.reply(`Role ${role.name} will now be assigned at level ${level}. Stack roles: ${levelRoles.stackRoles}`);
  },
};
