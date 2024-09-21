const WelcomeSettings = require('../models/WelcomeSettings');
const JoinableRole = require('../models/JoinableRole'); // Import joinable role model
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const guildID = member.guild.id;

    // Fetch the joinable role from the database
    const joinableRole = await JoinableRole.findOne({ guildID });

    if (joinableRole && joinableRole.roleID) {
      const role = member.guild.roles.cache.get(joinableRole.roleID);

      if (role) {
        // Assign the joinable role to the new member
        await member.roles.add(role);
        console.log(`Assigned role ${role.name} to new member ${member.user.tag}`);
      } else {
        console.error(`Role with ID ${joinableRole.roleID} not found in guild ${guildID}`);
      }
    }

    // Fetch the welcome message settings from the database
    const welcomeSettings = await WelcomeSettings.findOne({ guildId: guildID });

    if (!welcomeSettings) return; // No welcome settings found for this guild

    const welcomeChannel = member.guild.channels.cache.get(welcomeSettings.channelId);
    if (!welcomeChannel) return; // Channel not found

    // Create the welcome embed with custom settings
    const embed = new EmbedBuilder()
      .setColor('YELLOW')
      .setTitle(welcomeSettings.title || 'Welcome!')
      .setDescription(
        welcomeSettings.description.replace('{user}', member.toString()) || 
        `Welcome, **${member.user.username}** to the server! We hope you enjoy your stay! 🎉`
      )
      .setThumbnail(welcomeSettings.thumbnail || member.user.displayAvatarURL())
      .setTimestamp();

    // Send the welcome message to the configured channel
    welcomeChannel.send({ embeds: [embed] });
  },
};
