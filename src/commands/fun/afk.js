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
    const botMember = interaction.guild.members.me;  // The bot's own member object

    // Check if bot has permission to change nickname
    if (!botMember.permissions.has('ManageNicknames')) {
      return interaction.reply('I do not have permission to change your nickname.');
    }

    // Check if the bot's highest role is higher than the user's highest role
    if (member.roles.highest.position >= botMember.roles.highest.position) {
      return interaction.reply('I cannot change your nickname due to role hierarchy.');
    }

    try {
      // Try to set the user's nickname
      await member.setNickname(`[AFK] ${interaction.user.username}`, 'Set AFK status');
      await interaction.reply(`${interaction.user.username} is now AFK: ${reason}`);
    } catch (error) {
      console.error('Error setting AFK:', error);
      await interaction.reply('I was unable to set your AFK status due to a permission error.');
    }
  },
  afkUsers,
};
