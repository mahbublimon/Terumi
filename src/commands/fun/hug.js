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
