const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the server level leaderboard')
    .addNumberOption(option => 
      option.setName('balance')
        .setDescription('Number of users to display')
        .setRequired(false)),

  async execute(interaction) {
    const balance = interaction.options.getNumber('balance') || 10;
    const users = await User.find({ guildID: interaction.guild.id })
      .sort({ level: -1, experience: -1 })
      .limit(balance);

    if (!users.length) return interaction.reply('No users found on the leaderboard.');

    const embed = new EmbedBuilder()
      .setTitle('Server Leaderboard')
      .setDescription(
        users
          .map((user, i) => `**${i + 1}.** <@${user.userID}> - Level ${user.level} (${user.experience} XP)`)
          .join('\n')
      )
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  },
};
