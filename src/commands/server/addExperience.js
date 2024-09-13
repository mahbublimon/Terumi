const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addexperience')
    .setDescription('Add or remove experience from a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to add experience to')
        .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('The amount of experience to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const userData = await User.findOne({ userID: user.id, guildID: interaction.guild.id });
    if (!userData) {
      return interaction.reply({ content: 'User data not found.', ephemeral: true });
    }

    userData.experience += amount;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Experience Added')
      .setDescription(`${user.username} has been given **${amount} experience points**!`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
