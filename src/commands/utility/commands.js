const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Get a list of all commands'),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Green) // Use Colors.Green for the color
      .setTitle('Available Commands')
      .setDescription('Here are all the available commands for the bot:')
      .addFields(
        { name: '/ping', value: 'Check the bot\'s latency', inline: true },
        { name: '/help', value: 'Get help with the bot', inline: true },
        // Add more commands here
      )
      .setFooter({ text: 'Use /command_name to execute a command!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
