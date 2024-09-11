// src/commands/leveling/profile.js
const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'profile',
    description: 'Shows your server profile',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to show the profile of',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = await User.findOne({ userID: target.id, guildID: interaction.guild.id });

    if (!user) return interaction.reply(`${target.username} has no profile yet.`);

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Profile`)
      .addFields(
        { name: 'Level', value: user.level.toString(), inline: true },
        { name: 'Experience', value: user.experience.toString(), inline: true },
        { name: 'Reputation', value: user.reputation.toString(), inline: true }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  },
};
