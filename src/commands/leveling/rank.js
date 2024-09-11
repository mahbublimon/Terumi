// src/commands/leveling/rank.js
const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'rank',
    description: 'Shows your current rank',
  },
  async execute(interaction) {
    const user = await User.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    if (!user) return interaction.reply('You have no rank yet.');

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s Rank`)
      .addFields({ name: 'Level', value: user.level.toString() })
      .addFields({ name: 'Experience', value: user.experience.toString() })
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  },
};
