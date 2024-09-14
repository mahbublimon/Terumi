const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Suggestion = require('../../models/Suggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestions')
    .setDescription('Manage suggestions')
    .addStringOption(option =>
      option.setName('accept')
        .setDescription('Accept a suggestion by ID')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('comment')
        .setDescription('Comment on the suggestion')
        .setRequired(true)
    ),
  async execute(interaction) {
    const suggestionId = interaction.options.getString('accept');
    const comment = interaction.options.getString('comment');

    const suggestion = await Suggestion.findOne({ _id: suggestionId });
    if (!suggestion) {
      return interaction.reply({ content: 'Suggestion not found.', ephemeral: true });
    }

    suggestion.status = 'accepted';
    suggestion.comment = comment;
    await suggestion.save();

    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Suggestion Accepted')
      .setDescription(`**Suggestion ID**: ${suggestionId}\n**Comment**: ${comment}`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
