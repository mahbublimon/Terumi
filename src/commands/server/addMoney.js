// src/commands/server/addMoney.js
const { MessageEmbed } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: {
    name: 'add money',
    description: 'Add chat credits to a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to add money to',
        required: true,
      },
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Amount of money to add',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const userData = await User.findOne({ userID: user.id, guildID: interaction.guild.id });
    if (!userData) {
      return interaction.reply({ content: 'User data not found.', ephemeral: true });
    }

    userData.money += amount;
    await userData.save();

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Credits Added')
      .setDescription(`${user.username} has been given **${amount} credits**!`)
      .addField('Total Credits', `${userData.money}`, true)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
