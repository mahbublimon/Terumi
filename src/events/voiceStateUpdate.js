const { ChannelType } = require('discord.js');
const TempChannel = require('../models/TempChannel'); // Import the TempChannel model

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Check if the user joined a voice channel
    if (!newState.channel || newState.channel.type !== ChannelType.GuildVoice) return;

    // Check if the joined channel is the one set for creating temporary channels
    const tempChannel = await TempChannel.findOne({ guildID: newState.guild.id });
    if (!tempChannel || newState.channel.id !== tempChannel.channelID) return;

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

      // Move the user to the new temporary channel
      await newState.setChannel(tempVoiceChannel);

      // Delete the channel when it's empty
      tempVoiceChannel.setParent(newState.channel.parent); // Set same category
      const checkChannel = async () => {
        if (tempVoiceChannel.members.size === 0) {
          await tempVoiceChannel.delete();
        }
      };

      // Wait for a few seconds before checking if the channel is empty
      setTimeout(checkChannel, 5000);
    } catch (error) {
      console.error('Error creating temp voice channel:', error);
    }
  },
};
