const { SlashCommandBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');
const ms = require('ms'); // For time parsing

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user for a specified duration')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration of mute (e.g., 10m, 1h)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for muting the user')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason');
    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole) {
      return interaction.reply('Mute role not found. Please create a role called "Muted".');
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (member.roles.cache.has(muteRole.id)) {
      return interaction.reply('User is already muted.');
    }

    await member.roles.add(muteRole);
    await interaction.reply(`${user.username} has been muted for ${duration}. Reason: ${reason}`);

    // Unmute after the specified duration
    setTimeout(async () => {
      if (member.roles.cache.has(muteRole.id)) {
        await member.roles.remove(muteRole);
        await member.send('You have been unmuted.');
      }
    }, ms(duration));
  },
};
