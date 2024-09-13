const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('Add chat credits to a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to add money to')
        .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Amount of money to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const userData = await User.findOne({ userID: user.id, guildID: interaction.guild.id });
    if (!userData) {
      return interaction.reply({ content: 'User data not found.', ephemeral: true });
    }

    userData.money += amount;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor('BLUE')
      .setTitle('Credits Added')
      .setDescription(`${user.username} has been given **${amount} credits**!`)
      .addFields({ name: 'Total Credits', value: `${userData.money}`, inline: true })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
