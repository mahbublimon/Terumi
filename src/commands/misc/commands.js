// src/commands/misc/commands.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'commands',
    description: 'Get a list of all commands',
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
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
