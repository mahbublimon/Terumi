const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { getRequiredXP } = require('../../utils/leveling');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Shows your current rank on the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to show the rank of')
        .setRequired(false)),

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
