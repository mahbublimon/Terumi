const { SlashCommandBuilder } = require('@discordjs/builders');
const spotifyApi = require('../../utils/spotifyClient'); // Import the correct Spotify client
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
      const result = await spotifyApi.searchTracks(query);
      const track = result.body.tracks.items[0];

      if (!track) {
        return interaction.reply({ content: `No results found for ${query}!`, ephemeral: true });
      }

      // Send "Now Playing" embed
      const playEmbed = new EmbedBuilder()
        .setTitle('🎶 Now Playing')
        .setDescription(`**[${track.name}](${track.external_urls.spotify})** by ${track.artists.map(artist => artist.name).join(', ')}`)
        .setThumbnail(track.album.images[0].url)
        .setColor('#1DB954'); // Spotify Green

      return interaction.reply({ embeds: [playEmbed] });
    } catch (error) {
      console.error('Error playing music:', error);
      return interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  },
};
