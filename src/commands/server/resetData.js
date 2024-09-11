// src/commands/server/resetData.js
const User = require('../../models/User');

module.exports = {
  data: {
    name: 'reset',
    description: 'Reset user data like levels or credits',
    options: [
      {
        name: 'data_type',
        type: 'STRING',
        description: 'The type of data to reset (e.g., levels, credits)',
        required: true,
        choices: [
          { name: 'levels', value: 'levels' },
          { name: 'credits', value: 'credits' },
        ],
      },
    ],
  },
  async execute(interaction) {
    const dataType = interaction.options.getString('data_type');
    const users = await User.find({ guildID: interaction.guild.id });

    for (const user of users) {
      if (dataType === 'levels') {
        user.level = 0;
      } else if (dataType === 'credits') {
        user.money = 0;
      }
      await user.save();
    }

    return interaction.reply({ content: `All users' ${dataType} have been reset!` });
  },
};
