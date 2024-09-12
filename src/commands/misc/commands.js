const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Get a list of all commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('BLUE')
      .setTitle('Command List')
      .setDescription(`
        Here are all the available commands:

        - /commands: Get a list of all commands.
        - /help: Need help? This command explains how.
        - /ping: Check if Terumi is responsive.
        - /vote: Support Terumi by voting!
        - /reminder: Set a reminder.
        - /suggest: Submit a suggestion for the server.
      `)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
