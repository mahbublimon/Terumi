const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reddit')
    .setDescription('Get a random Reddit post'),

  async execute(interaction) {
    try {
      const response = await axios.get('https://www.reddit.com/r/popular/random/.json');
      const post = response.data[0].data.children[0].data;

      await interaction.reply(`**${post.title}**\n${post.url}`);
    } catch (error) {
      await interaction.reply('Failed to fetch Reddit post.');
    }
  },
};
