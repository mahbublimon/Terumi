const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Fetch a random meme'),

  async execute(interaction) {
    try {
      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;

      await interaction.reply({
        content: `${meme.title}\n${meme.url}`,
        embeds: [{ image: { url: meme.url } }],
      });
    } catch (error) {
      await interaction.reply('Failed to fetch meme.');
    }
  },
};
