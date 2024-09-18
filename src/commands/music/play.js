const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option => 
      option.setName('query').setDescription('Song title or Spotify URL').setRequired(true)),
  
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply(`No results found for "${query}"!`);
    }

    try {
      await playSpotifyTrack(interaction, track.preview_url);
      interaction.reply(`Now playing: ${track.name} by ${track.artists.map(a => a.name).join(', ')}`);
    } catch (error) {
      console.error(error);
      interaction.reply('Error playing the track.');
    }
  },
};
