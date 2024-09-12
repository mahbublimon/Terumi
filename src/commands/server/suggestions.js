// src/commands/server/suggestions.js
const { MessageEmbed } = require('discord.js');
const Suggestion = require('../../models/Suggestion');

module.exports = {
  data: {
    name: 'suggestions',
    description: 'Manage suggestions',
    options: [
      {
        name: 'accept',
        type: 'STRING',
        description: 'Accept a suggestion by ID',
        required: true,
      },
      {
        name: 'comment',
        type: 'STRING',
        description: 'Comment on the suggestion',
        required: true,
      },
    ],
  },
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

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Suggestion Accepted')
      .setDescription(`**Suggestion ID**: ${suggestionId}\n**Comment**: ${comment}`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
