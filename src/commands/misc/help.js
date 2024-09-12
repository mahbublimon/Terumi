// src/commands/misc/help.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'help',
    description: 'Get help on how to use Terumi',
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setTitle('Help')
      .setDescription(`
        Need help with Terumi?

        - Use /commands to get a list of all commands.
        - If you're having trouble, contact the server moderators.
      `)
      .setFooter('For more detailed information, visit our support server.')
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
