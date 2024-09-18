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

    try {
      // Remove the second interaction.reply() call to avoid multiple replies
      await playSpotifyTrack(interaction, track.preview_url);
    } catch (error) {
      console.error(error);
      // Only reply with an error if the interaction hasn't been replied to yet
      if (!interaction.replied) {
        interaction.reply({ content: 'Error playing the track.', ephemeral: true });
      }
    }
  },
};
