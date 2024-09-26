const { ChannelType } = require('discord.js');
const TempChannel = require('../models/TempChannel'); // Assuming TempChannel model exists

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Ignore if it's not a voice state change
    if (!newState.channel || newState.channel.type !== ChannelType.GuildVoice) return;

    // Find the temp channel configuration for the server
    const tempChannelConfig = await TempChannel.findOne({ guildID: newState.guild.id });

    if (!tempChannelConfig) {
      console.log('No temporary voice channel configuration found for this guild.');
      return;
    }

    // Check if the user joined the "creator" voice channel
    if (newState.channel.id !== tempChannelConfig.channelID) return;

    const guild = newState.guild;
    const user = newState.member.user;

    try {
      // Create a temporary voice channel under the same category as the creator channel
      const parentCategory = newState.channel.parent; // Use the same category as the creator channel
      
      const tempVoiceChannel = await guild.channels.create({
        name: `${user.username}'s Voice Channel`,
        type: ChannelType.GuildVoice,
        parent: parentCategory ? parentCategory.id : null,
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['ManageChannels', 'MoveMembers'], // Allow the user to manage their channel
          },
          {
            id: guild.roles.everyone.id,
            allow: ['Connect'],
          },
        ],
      });

      console.log(`Created temporary channel: ${tempVoiceChannel.name}`);

      // Move the user to the temporary voice channel
      await newState.setChannel(tempVoiceChannel);

      console.log(`Moved user ${user.username} to ${tempVoiceChannel.name}`);

      // Delete the temporary voice channel when it's empty
      const checkIfEmpty = () => {
        if (tempVoiceChannel.members.size === 0) {
          tempVoiceChannel.delete().then(() => {
            console.log(`Deleted empty temporary channel: ${tempVoiceChannel.name}`);
          }).catch(console.error);
        }
      };

      // Set an interval to check periodically if the channel is empty
      const intervalId = setInterval(() => {
        checkIfEmpty();
        if (!tempVoiceChannel || tempVoiceChannel.deleted) {
          clearInterval(intervalId); // Stop checking if the channel has been deleted
        }
      }, 10000); // Check every 10 seconds

    } catch (error) {
      console.error('Error creating temporary voice channel:', error);
    }
  },
};
