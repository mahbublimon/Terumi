// src/commands/misc/suggest.js
const { MessageEmbed } = require('discord.js');
const Suggestion = require('../../models/Suggestion'); // Assuming you use a Suggestion model to store suggestions

module.exports = {
  data: {
    name: 'suggest',
    description: 'Submit a suggestion for the server',
    options: [
      {
        name: 'suggestion',
        type: 'STRING',
        description: 'The suggestion you want to submit',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const suggestionText = interaction.options.getString('suggestion');
    const suggestion = new Suggestion({
      userID: interaction.user.id,
      suggestion: suggestionText,
      guildID: interaction.guild.id,
      status: 'pending',
    });
    await suggestion.save();

    const embed = new MessageEmbed()
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
