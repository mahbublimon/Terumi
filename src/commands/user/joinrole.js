const { SlashCommandBuilder } = require('discord.js');
const { getJoinableRole } = require('../../utils/roleManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joinrole')
    .setDescription('Join the joinable role.'),
  
  async execute(interaction) {
    const joinableRoleId = getJoinableRole(interaction.guild);

    // Check if a joinable role has been set
    if (!joinableRoleId) {
      return interaction.reply({ content: 'No joinable role has been set for this server.', ephemeral: true });
    }

    const role = interaction.guild.roles.cache.get(joinableRoleId);

    // Check if the user already has the role
    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `You already have the **${role.name}** role.`, ephemeral: true });
    }

    // Add the role to the user
    await interaction.member.roles.add(role);
    await interaction.reply(`You have joined the **${role.name}** role.`);
  },
};
