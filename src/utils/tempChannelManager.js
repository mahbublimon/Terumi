module.exports = {
  async createTempChannel(guild, member) {
    try {
      // Create a new temporary voice channel named after the user
      const tempChannel = await guild.channels.create({
        name: `${member.user.username}'s voice`,
        type: 'GUILD_VOICE',
        parent: member.voice.channel.parent, // Set the category to match the parent channel if applicable
        permissionOverwrites: [
          {
            id: member.id, // Allow the user to manage their own channel
            allow: ['MANAGE_CHANNELS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],
          },
          {
            id: guild.id, // Deny access for everyone else initially
            deny: ['CONNECT'],
          },
        ],
      });

      // Move the member into the new temp channel
      await member.voice.setChannel(tempChannel);

      console.log(`Created temp voice channel: ${tempChannel.name} for ${member.user.tag}`);
    } catch (error) {
      console.error('Error creating temp channel:', error);
    }
  },

  async deleteTempChannel(channel) {
    try {
      await channel.delete();
      console.log(`Deleted temp voice channel: ${channel.name}`);
    } catch (error) {
      console.error('Error deleting temp channel:', error);
    }
  }
};
