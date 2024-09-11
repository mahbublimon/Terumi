// src/commands/server/addMoney.js
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

    return interaction.reply(`${user.username} has been given ${amount} chat credits! They now have ${userData.money}.`);
  },
};
