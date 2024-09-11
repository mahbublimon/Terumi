// src/commands/leveling/rank.js
const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');
const { getRequiredXP } = require('../../utils/leveling');

module.exports = {
  data: {
    name: 'rank',
    description: 'Shows your current rank on the server',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to show the rank of',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = await User.findOne({ userID: target.id, guildID: interaction.guild.id });

    if (!user) return interaction.reply(`${target.username} has no rank yet.`);

    const requiredXP = getRequiredXP(user.level);
    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Rank`)
      .addFields(
        { name: 'Level', value: user.level.toString(), inline: true },
        { name: 'Experience', value: `${user.experience}/${requiredXP} XP`, inline: true }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  },
};
