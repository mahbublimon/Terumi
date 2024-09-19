const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to unmute')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole || !member.roles.cache.has(muteRole.id)) {
      return interaction.reply('User is not muted.');
    }

    await member.roles.remove(muteRole);

    const embed = new EmbedBuilder()
      .setTitle('User Unmuted')
      .setColor(0x00FF00)
      .addFields({ name: 'User', value: `${user.username}`, inline: true });

    const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 10000);
  },
};
