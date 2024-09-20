const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('Pat someone')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to pat')
        .setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const gifResponse = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
      params: {
        api_key: process.env.GIPHY_API,
        tag: 'pat',
      },
    });

    const gifUrl = gifResponse.data.data.images.original.url;

    const embed = new EmbedBuilder()
      .setDescription(`**${interaction.user} patted ${target}!**`)
      .setImage(gifUrl)
      .setColor(0xFFC0CB); 

    await interaction.reply({ embeds: [embed] });
  },
};
