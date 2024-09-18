const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify or another source')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      // Defer reply to allow the bot time to search and play the track
      await interaction.deferReply();

      // Search for the track on Spotify
      const track = await searchSpotifyTrack(query);
      if (!track) {
        return interaction.editReply(`No results found for "${query}"!`);
      }

      // Play the track using playSpotifyTrack (handles playing preview or fallback to YouTube)
      await playSpotifyTrack(interaction, track);

      // Edit the deferred reply with success message
      await interaction.editReply(`Now playing: **${track.name}** by ${track.artists.map(a => a.name).join(', ')}`);
    } catch (error) {
      console.error('Error playing the track:', error);

      // Handle errors gracefully and reply if not already done
      if (interaction.deferred) {
        await interaction.editReply('There was an error playing the track.');
      } else if (!interaction.replied) {
        await interaction.reply('There was an error playing the track.');
      }
    }
  },
};
