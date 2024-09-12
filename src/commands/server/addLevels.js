// src/commands/server/addLevels.js
const { MessageEmbed } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: {
    name: 'add levels',
    description: 'Add levels to a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to add levels to',
        required: true,
      },
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Amount of levels to add',
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

    userData.level += amount;
    await userData.save();

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Levels Added')
      .setDescription(`${user.username} has been given **${amount} levels**!`)
      .addField('New Level', `${userData.level}`, true)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
