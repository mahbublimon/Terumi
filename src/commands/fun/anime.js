// src/commands/fun/anime.js
const axios = require('axios');

module.exports = {
  data: {
    name: 'anime',
    description: 'Get information about an anime',
    options: [
      {
        name: 'title',
        type: 'STRING',
        description: 'The title of the anime',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const apiKey = process.env.MYANIMELIST_API_KEY; // Store in .env file

    try {
      const response = await axios.get(`https://api.myanimelist.net/v2/anime`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          q: title,
          limit: 1,
        },
      });

      const anime = response.data.data[0].node;
      await interaction.reply(`**${anime.title}**\n${anime.synopsis}\n[MyAnimeList](https://myanimelist.net/anime/${anime.id})`);
    } catch (error) {
      await interaction.reply('Anime not found.');
    }
  },
};
