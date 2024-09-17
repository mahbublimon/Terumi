const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack, playSpotifyTrack } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.reply({ content: `No results found for "${query}"!`, ephemeral: true });
    }

    try {
      await playSpotifyTrack(interaction, track);
    } catch (error) {
      console.error('Error playing track:', error);
      interaction.reply({ content: 'There was an error playing the track!', ephemeral: true });
    }
  },
};
