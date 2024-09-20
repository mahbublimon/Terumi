const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const JoinableRole = require('../../models/JoinableRole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setjoinablerole')
    .setDescription('Set the role to assign to new members automatically')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('The role to assign to new members')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    const guildID = interaction.guild.id;

    try {
      // Upsert the joinable role in the database
      await JoinableRole.findOneAndUpdate(
        { guildID },
        { roleID: role.id },
        { upsert: true }
      );

      await interaction.reply(`The role ${role.name} has been set as the joinable role.`);
    } catch (error) {
      console.error('Error setting joinable role:', error);
      await interaction.reply('Failed to set the joinable role. Please try again later.');
    }
  },
};
