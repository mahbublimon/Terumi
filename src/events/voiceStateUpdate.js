const { ChannelType } = require('discord.js');
const TempChannel = require('../models/TempChannel'); // Import the TempChannel model

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Check if the user joined a voice channel
    if (!newState.channel || newState.channel.type !== ChannelType.GuildVoice) return;

    console.log(`User ${newState.member.user.username} joined ${newState.channel.name}`);

    // Fetch the temp channel config for this guild from the database
    const tempChannelConfig = await TempChannel.findOne({ guildID: newState.guild.id });
    if (!tempChannelConfig) {
      console.log('No temp channel config found for this guild.');
      return;
    }

    // Ensure the joined channel matches the configured "Creator Channel"
    if (newState.channel.id !== tempChannelConfig.channelID) {
      console.log(`Joined channel ID ${newState.channel.id} does not match the temp channel creator ID ${tempChannelConfig.channelID}`);
      return;
    }

    console.log(`Creating temporary voice channel for user ${newState.member.user.username}`);

    // Create the temporary voice channel under the same category as the "Creator Channel"
    const guild = newState.guild;
    const user = newState.member.user;
    const parentCategory = newState.channel.parent; // Parent category (the same as the "Creator Channel")

    try {
      // Create a temporary voice channel
      const tempVoiceChannel = await guild.channels.create({
        name: `${user.username}'s Voice Channel`,
        type: ChannelType.GuildVoice,
        parent: parentCategory ? parentCategory.id : null, // Place the channel in the same category as the "Creator Channel"
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['ManageChannels', 'MoveMembers'], // Allow the user to manage and move members in the channel
          },
          {
            id: guild.roles.everyone.id, // Default permissions for everyone
            allow: ['Connect'],
          },
        ],
      });

      console.log(`Temporary channel created: ${tempVoiceChannel.name}`);

      // Move the user into the new temporary voice channel
      await newState.setChannel(tempVoiceChannel);
      console.log(`Moved user to ${tempVoiceChannel.name}`);

      // Delete the temporary channel once it's empty
      const checkChannel = async () => {
        if (tempVoiceChannel.members.size === 0) {
          console.log(`Deleting empty temporary channel: ${tempVoiceChannel.name}`);
          await tempVoiceChannel.delete();
        }
      };

      // Set a timeout to check if the channel is empty after 30 seconds
      setTimeout(checkChannel, 30000); // 30 seconds
    } catch (error) {
      console.error('Error creating or managing temporary voice channel:', error);
    }
  },
};
