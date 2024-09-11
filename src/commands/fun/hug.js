// src/commands/fun/hug.js
const axios = require('axios');

module.exports = {
  data: {
    name: 'hug',
    description: 'Hug someone',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'User to hug',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const gifResponse = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
      params: {
        api_key: process.env.GIPHY_SDK,
        tag: 'hug',
      },
    });

    const gifUrl = gifResponse.data.data.images.original.url;

    await interaction.reply(`${interaction.user.username} hugged ${target.username}! ${gifUrl}`);
  },
};
