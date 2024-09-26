const { ChannelType } = require('discord.js');
const TempChannel = require('../models/TempChannel'); // Import the TempChannel model

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Check if the user joined a voice channel
    if (!newState.channel || newState.channel.type !== ChannelType.GuildVoice) return;

    console.log(`User ${newState.member.user.username} joined ${newState.channel.name}`);

    // Check if the joined channel is the one set for creating temporary channels
    const tempChannel = await TempChannel.findOne({ guildID: newState.guild.id });
    if (!tempChannel) {
      console.log('No temp channel set for this guild.');
      return;
    }
    console.log(`Temp channel trigger is set to channel ID: ${tempChannel.channelID}`);

    if (newState.channel.id !== tempChannel.channelID) {
      console.log(`Joined channel ${newState.channel.id} does not match the temp channel trigger ${tempChannel.channelID}`);
      return;
    }

    console.log(`Creating temporary voice channel for user ${newState.member.user.username}`);

    // Create a new temporary voice channel
    const guild = newState.guild;
    const user = newState.member.user;

    try {
      const tempVoiceChannel = await guild.channels.create({
        name: `${user.username}'s voice channel`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parent, // Place in the same category as the source channel
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['ManageChannels', 'MoveMembers'], // Give the user temporary management permissions
          },
          {
            id: guild.roles.everyone.id, // Default permissions for everyone
            allow: ['Connect'],
          },
        ],
      });

      console.log(`Temporary channel created: ${tempVoiceChannel.name}`);

      // Move the user to the new temporary channel
      await newState.setChannel(tempVoiceChannel);

      console.log(`Moved user to ${tempVoiceChannel.name}`);

      // Delete the channel when it's empty
      const checkChannel = async () => {
        if (tempVoiceChannel.members.size === 0) {
          console.log(`Deleting empty channel: ${tempVoiceChannel.name}`);
          await tempVoiceChannel.delete();
        }
      };

      // Check if the channel is empty after 5 seconds
      setTimeout(checkChannel, 5000);
    } catch (error) {
      console.error('Error creating temp voice channel:', error);
    }
  },
};
