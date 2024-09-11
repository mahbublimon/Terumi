// src/commands/fun/youtube.js
const axios = require('axios');

module.exports = {
  data: {
    name: 'youtube',
    description: 'Search for a YouTube channel',
    options: [
      {
        name: 'channel',
        type: 'STRING',
        description: 'Channel name to search for',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const channel = interaction.options.getString('channel');
    const apiKey = process.env.YOUTUBE_API_KEY; // Store in .env file

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: channel,
          type: 'channel',
          key: apiKey,
        },
      });

      const data = response.data.items[0];
      const channelInfo = data.snippet;

      await interaction.reply(`Channel found: [${channelInfo.title}](https://youtube.com/channel/${data.id.channelId})`);
    } catch (error) {
      await interaction.reply('Channel not found.');
    }
  },
};
