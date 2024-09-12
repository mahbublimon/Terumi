const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help on how to use Terumi'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('YELLOW')
      .setTitle('Help')
      .setDescription(`
        Need help with Terumi?

        - Use /commands to get a list of all commands.
        - If you're having trouble, contact the server moderators.
      `)
      .setFooter({ text: 'For more detailed information, visit our support server.' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
