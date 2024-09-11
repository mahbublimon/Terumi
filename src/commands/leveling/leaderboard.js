// src/commands/leveling/leaderboard.js
const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'leaderboard',
    description: 'Shows the server level leaderboard',
    options: [
      {
        name: 'balance',
        type: 'NUMBER',
        description: 'Number of users to display',
        required: false,
      },
    ],
  },
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
