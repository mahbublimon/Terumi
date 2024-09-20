const { SlashCommandBuilder } = require('discord.js');
const { getJoinableRole } = require('../../utils/roleManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaverole')
    .setDescription('Leave the joinable role.'),
  
  async execute(interaction) {
    // Fetch the joinable role from the database
    const role = await getJoinableRole(interaction.guild);

    // Check if a joinable role has been set
    if (!role) {
      return interaction.reply({ content: 'No joinable role has been set for this server.', ephemeral: true });
    }

    // Check if the user has the role
    if (!interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `You do not have the **${role.name}** role.`, ephemeral: true });
    }

    // Remove the role from the user
    await interaction.member.roles.remove(role);
    await interaction.reply(`You have left the **${role.name}** role.`);
  },
};
