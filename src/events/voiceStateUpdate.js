const TempChannel = require('../models/TempChannel');
const { createTempChannel, deleteTempChannel } = require('../utils/tempChannelManager');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // If the user is just moving within voice channels (ignoring leave/join)
    if (oldState.channelId === newState.channelId) return;

    const guild = newState.guild;
    const member = newState.member;

    // Check if the user joined a voice channel
    if (newState.channelId) {
      // Get the designated temp channel for this guild
      const tempChannel = await TempChannel.findOne({ guildID: guild.id });

      if (tempChannel && newState.channelId === tempChannel.channelID) {
        // User joined the temp channel creator, create a new personal voice channel
        await createTempChannel(guild, member);
      }
    }

    // Check if the user left a temp voice channel
    if (oldState.channelId && oldState.channel) {
      if (oldState.channel.members.size === 0 && oldState.channel.name.endsWith("'s voice")) {
        // No users left, delete the channel
        await deleteTempChannel(oldState.channel);
      }
    }
  }
};
