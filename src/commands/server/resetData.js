const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset user data like levels or credits')
    .addStringOption(option => 
      option.setName('data_type')
        .setDescription('The type of data to reset (e.g., levels, credits)')
        .setRequired(true)
        .addChoices(
          { name: 'levels', value: 'levels' },
          { name: 'credits', value: 'credits' }
        )
    ),
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

    const embed = new EmbedBuilder()
      .setColor('RED')
      .setTitle('Data Reset')
      .setDescription(`All users' **${dataType}** have been reset!`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
