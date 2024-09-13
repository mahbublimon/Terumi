const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addlevels')
    .setDescription('Add levels to a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to add levels to')
        .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Amount of levels to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const userData = await User.findOne({ userID: user.id, guildID: interaction.guild.id });
    if (!userData) {
      return interaction.reply({ content: 'User data not found.', ephemeral: true });
    }

    userData.level += amount;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Levels Added')
      .setDescription(`${user.username} has been given **${amount} levels**!`)
      .addFields({ name: 'New Level', value: `${userData.level}`, inline: true })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
