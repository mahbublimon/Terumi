const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Search for a YouTube channel')
    .addStringOption(option =>
      option.setName('channel')
        .setDescription('Channel name to search for')
        .setRequired(true)),

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
