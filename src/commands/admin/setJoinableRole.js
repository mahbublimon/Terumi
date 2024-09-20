const { SlashCommandBuilder } = require('discord.js');
const JoinableRole = require('../../models/JoinableRole');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setjoinrole')
    .setDescription('Set a role to be automatically assigned when new members join.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign to new members')
        .setRequired(true)),

  async execute(interaction) {
    // Check if the user has admin permissions
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');

    // Save the joinable role to the database
    await JoinableRole.findOneAndUpdate(
      { guildID: interaction.guild.id },
      { roleID: role.id },
      { upsert: true }
    );

    return interaction.reply(`The role ${role.name} will now be automatically assigned to new members.`);
  },
};
