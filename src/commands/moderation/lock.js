const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to lock')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    // Use PermissionsBitField.Flags instead of just 'SEND_MESSAGES'
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      [PermissionsBitField.Flags.SendMessages]: false,
    });

    await interaction.reply(`${channel.name} has been locked.`);
  },
};
