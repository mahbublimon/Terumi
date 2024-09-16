const { SlashCommandBuilder } = require('@discordjs/builders');
const musicPlayer = require('../../utils/musicPlayer'); // Updated import
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song title or URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel to play music!', ephemeral: true });
    }

    try {
      // Use Spotify API to search for the track
      const track = await musicPlayer.searchSpotifyTrack(query);

      if (!track) {
        return interaction.reply({ content: `No results found for ${query}!`, ephemeral: true });
      }

      // Call the play function
      const trackUrl = track.external_urls.spotify; // Spotify URL for the track
      await musicPlayer.play(interaction, trackUrl, track); // Pass track information for playback
    } catch (error) {
      console.error('Error playing music:', error);
      return interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  },
};
