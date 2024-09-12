const { SlashCommandBuilder } = require('discord.js');
const LevelRoles = require('../../models/LevelRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlevelroles')
    .setDescription('Set role rewards for reaching specific levels')
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('The level at which the role is assigned')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to be assigned at that level')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('stack_roles')
        .setDescription('Should roles stack (true) or not (false)')
        .setRequired(false)),

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
