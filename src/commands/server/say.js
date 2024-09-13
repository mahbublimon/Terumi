const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a custom message as Terumi')
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor('PURPLE')
      .setTitle('Message from Terumi')
      .setDescription(message)
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
};
