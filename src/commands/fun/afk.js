const { SlashCommandBuilder } = require('discord.js');

// A map to store AFK users and their reason
const afkUsers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for being AFK')
        .setRequired(false)
    ),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    const member = interaction.member;

    // Check if the user already has AFK set
    if (afkUsers.has(member.id)) {
      return interaction.reply({ content: 'You are already AFK!', ephemeral: true });
    }

    // Store the AFK reason and timestamp
    afkUsers.set(member.id, { reason, timestamp: Date.now() });

    // Rename the user with [AFK]
    const originalNickname = member.nickname || member.user.username;
    const afkNickname = `[AFK] ${originalNickname}`;
    
    try {
      await member.setNickname(afkNickname, `Set AFK status: ${reason}`);
      await member.setPresence({ status: 'dnd' }); // Set user's status to Do Not Disturb (DND)
      
      await interaction.reply(`${member.user.username} is now AFK: ${reason}`);
    } catch (error) {
      console.error('Error setting AFK:', error);
      await interaction.reply({ content: 'Failed to set AFK status due to insufficient permissions.', ephemeral: true });
    }
  },

  // Export the AFK users map to be used in messageCreate event or elsewhere
  afkUsers
};
