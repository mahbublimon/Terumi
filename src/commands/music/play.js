const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Update to EmbedBuilder
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify or YouTube')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply(`No results found for "${query}"!`);
    }

    try {
      await playTrack(interaction, track);

      const embed = new EmbedBuilder() // Use EmbedBuilder instead of MessageEmbed
        .setTitle('Now Playing')
        .setDescription(`**${track.name}** by ${track.artists.map(a => a.name).join(', ')}`)
        .setColor('#1DB954'); // Spotify color

      await interaction.followUp({ embeds: [embed] });

    } catch (error) {
      console.error('Error executing play command:', error);
      await interaction.reply('Error playing the track.');
    }
  },
};
