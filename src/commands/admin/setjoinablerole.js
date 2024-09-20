const { SlashCommandBuilder } = require('discord.js');
const { setJoinableRole } = require('../../utils/roleManager');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setjoinablerole')
    .setDescription('Set a role as joinable for users.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to set as joinable')
        .setRequired(true)),
  
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    // Check if the user has admin permissions
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Set the role as joinable
    setJoinableRole(interaction.guild, role);
    await interaction.reply(`The role **${role.name}** is now joinable.`);
  },
};
