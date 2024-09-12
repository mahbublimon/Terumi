// src/commands/server/addExperience.js
const { MessageEmbed } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: {
    name: 'add experience',
    description: 'Add or remove experience from a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to add experience to',
        required: true,
      },
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'The amount of experience to add',
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

    userData.experience += amount;
    await userData.save();

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Experience Added')
      .setDescription(`${user.username} has been given **${amount} experience points**!`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
