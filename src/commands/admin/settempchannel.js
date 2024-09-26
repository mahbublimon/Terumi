const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const TempChannel = require('../../models/TempChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settempchannel')
    .setDescription('Set the channel for creating temporary voice channels')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The voice channel to use for creating temp voice channels')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    // Ensure the selected channel is a voice channel
    if (channel.type !== ChannelType.GuildVoice) { // Check if it is a voice channel
      return interaction.reply({ content: 'Please select a valid voice channel.', ephemeral: true });
    }

    // Check for admin permissions
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'You do not have permission to set the temporary voice channel.', ephemeral: true });
    }

    try {
      // Save or update the temp channel in the database
      await TempChannel.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { channelID: channel.id },
        { upsert: true, new: true }
      );

      return interaction.reply(`Temporary voice channel creator set to ${channel.name}`);
    } catch (error) {
      console.error('Error setting temp channel:', error);
      return interaction.reply({ content: 'Failed to set the temporary voice channel.', ephemeral: true });
    }
  }
};
