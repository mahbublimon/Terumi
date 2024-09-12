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
    afkUsers.set(interaction.user.id, { reason, timestamp: Date.now() });

    await interaction.reply(`${interaction.user.username} is now AFK: ${reason}`);
  },
  
  // Export the AFK users map to be used in messageCreate event
  afkUsers
};
