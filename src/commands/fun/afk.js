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

    const member = interaction.member;

    // Check if bot has permission to change nickname
    if (member.guild.me.permissions.has('MANAGE_NICKNAMES')) {
      try {
        await member.setNickname(`[AFK] ${interaction.user.username}`, 'Set AFK status');
        await member.setPresence({ status: 'dnd' }); // Set user to 'Do Not Disturb'
        await interaction.reply(`${interaction.user.username} is now AFK: ${reason}`);
      } catch (error) {
        console.error('Error setting AFK:', error);
        await interaction.reply('I was unable to set your AFK status due to insufficient permissions.');
      }
    } else {
      await interaction.reply('I do not have permission to change your nickname.');
    }
  },
  afkUsers,
};
