const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        api_key: process.env.GIPHY_API,
        tag: 'hug',
      },
    });

    const gifUrl = gifResponse.data.data.images.original.url;

    // Create an embed to hide the URL but display the GIF
    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user.username} hugged ${target.username}!`)
      .setImage(gifUrl)  // Display the GIF
      .setColor(0xFFC0CB);  // Optional: Set a color for the embed

    await interaction.reply({ embeds: [embed] });
  },
};
