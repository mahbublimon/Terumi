const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TempChannel = require('../../models/TempChannel'); // Assuming you have a TempChannel model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settempchannel')
    .setDescription('Set a channel to be used for creating temporary voice channels.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The voice channel to use as the creator for temporary channels')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Only users with Manage Channels permission can use this command
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    // Ensure it's a voice channel
    if (channel.type !== 'GUILD_VOICE') {
      return interaction.reply('Please select a valid voice channel.');
    }

    try {
      // Save or update the temporary channel creator in the database
      await TempChannel.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { channelID: channel.id },
        { upsert: true }
      );
      await interaction.reply(`Temporary voice channel creator set to ${channel.name}.`);
    } catch (error) {
      console.error('Error setting temp channel:', error);
      await interaction.reply('There was an error setting the temporary voice channel.');
    }
  },
};
