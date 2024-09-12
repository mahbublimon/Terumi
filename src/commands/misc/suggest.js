const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Suggestion = require('../../models/Suggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion for the server')
    .addStringOption(option =>
      option.setName('suggestion')
        .setDescription('The suggestion you want to submit')
        .setRequired(true)),

  async execute(interaction) {
    const suggestionText = interaction.options.getString('suggestion');
    const suggestion = new Suggestion({
      userID: interaction.user.id,
      suggestion: suggestionText,
      guildID: interaction.guild.id,
      status: 'pending',
    });
    await suggestion.save();

    const embed = new EmbedBuilder()
      .setColor('BLUE')
      .setTitle('New Suggestion')
      .setDescription(suggestionText)
      .setFooter(`Suggestion by ${interaction.user.tag}`)
      .setTimestamp();

    interaction.reply({ content: 'Your suggestion has been submitted!', ephemeral: true });

    const suggestionChannel = interaction.guild.channels.cache.find(c => c.name === 'suggestions');
    if (suggestionChannel) {
      suggestionChannel.send({ embeds: [embed] });
    }
  },
};
