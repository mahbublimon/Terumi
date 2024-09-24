const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Get a list of all available commands'),
  
  async execute(interaction) {
    const { client } = interaction; // Access the bot client

    // Fetch all commands from the client's command collection
    const commands = client.commands.map(cmd => `\`${cmd.data.name}\` - ${cmd.data.description}`).join('\n');

    // Create an embed message to list the commands
    const embed = new EmbedBuilder()
      .setTitle('Available Commands')
      .setDescription(commands || 'No commands available.')
      .setColor('GREEN')
      .setTimestamp();

    // Send the embed as a response to the interaction
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
