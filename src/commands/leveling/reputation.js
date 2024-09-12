const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reputation')
    .setDescription('Give a reputation point to someone')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to give reputation to')
        .setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    if (target.id === interaction.user.id) return interaction.reply('You cannot give reputation to yourself.');

    let targetUser = await User.findOne({ userID: target.id, guildID: interaction.guild.id });
    if (!targetUser) {
      targetUser = new User({ userID: target.id, guildID: interaction.guild.id });
    }

    targetUser.reputation += 1;
    await targetUser.save();

    await interaction.reply(`${target.username} has been given 1 reputation point!`);
  },
};
