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
      return interaction.reply({ content: `No results found for "${query}"!`, ephemeral: true });
    }

    // Check if there's a preview URL available
    if (!track.preview_url) {
      return interaction.reply({ content: `No preview available for "${track.name}"!`, ephemeral: true });
    }

    try {
      await playSpotifyTrack(interaction, track.preview_url);
      interaction.reply({ content: `Now playing: **${track.name}** by ${track.artists.map(a => a.name).join(', ')}`, ephemeral: false });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Error playing the track.', ephemeral: true });
    }
  },
};
