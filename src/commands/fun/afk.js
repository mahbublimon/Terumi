const { SlashCommandBuilder } = require('discord.js');
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

    try {
      await interaction.reply(`${interaction.user.username} is now AFK: ${reason}`);
    } catch (error) {
      console.error('Error setting AFK:', error);
      await interaction.reply('There was an error setting your AFK status.');
    }
  },
  afkUsers,
};
