const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Set your birthday (day:month:year)')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('Your birthday (DD/MM/YYYY)')
        .setRequired(true)),

  async execute(interaction) {
    const date = interaction.options.getString('date');
    const [day, month, year] = date.split('/').map(Number);

    if (!day || !month || !year) {
      return interaction.reply('Please provide a valid date in DD/MM/YYYY format.');
    }

    let user = await User.findOne({ userID: interaction.user.id });
    if (!user) {
      user = new User({ userID: interaction.user.id, guildID: interaction.guild.id });
    }

    user.birthday = { day, month, year };
    await user.save();

    await interaction.reply(`Birthday set to: ${day}/${month}/${year}`);
  },
};
