const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to hug')
        .setRequired(true)),

  async execute(interaction) {
    const apiKey = process.env.GIPHY_API_KEY; // Store your Giphy API key in .env

    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/random', {
        params: {
          api_key: apiKey,  // Correctly pass the API key here
          tag: 'hug',
        },
      });

    const gifUrl = gifResponse.data.data.images.original.url;

    await interaction.reply(`${interaction.user.username} hugged ${target.username}! ${gifUrl}`);
  },
};
