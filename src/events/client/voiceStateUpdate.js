// src/events/client/voiceStateUpdate.js
const TemporaryChannelSettings = require('../../models/TemporaryChannelSettings');

module.exports = async (oldState, newState) => {
  const guild = newState.guild;

  // Check if the user has joined a voice channel
  if (!newState.channelId || newState.channelId === oldState.channelId) return;

  // Fetch the temporary channel settings for this guild
  const settings = await TemporaryChannelSettings.findOne({ guildID: guild.id });
  if (!settings) return; // No settings configured, do nothing

  // Check if the user joined the creation channel
  if (newState.channelId === settings.createChannelID) {
    // Create a new voice channel for the user
    const channelName = settings.channelNameTemplate.replace('{user.name}', newState.member.user.username);
    const category = guild.channels.cache.get(settings.categoryID);

    const tempChannel = await guild.channels.create({
      name: channelName,
      type: 'GUILD_VOICE',
      parent: category,
      userLimit: settings.userLimit,
      permissionOverwrites: [
        {
          id: newState.member.id,
          allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER'],
        },
        {
          id: guild.roles.everyone.id,
          allow: ['CONNECT'],
        },
      ],
    });

    // Move the user to the new temporary channel
    await newState.setChannel(tempChannel);

    // Listen for the temporary channel being empty, then delete it
    const checkForEmptyChannel = async () => {
      if (tempChannel.members.size === 0) {
        await tempChannel.delete();
      }
    };

    // Check periodically if the channel is empty
    const interval = setInterval(checkForEmptyChannel, 5000);

    // Clear the interval once the channel is deleted
    tempChannel.once('deleted', () => clearInterval(interval));
  }
};
