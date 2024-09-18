const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { searchSpotifyTrack } = require('../../utils/spotifyClient');
const { playFullSong } = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song by searching on Spotify')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song title or Spotify URL')
        .setRequired(true)),
  
  async execute(interaction) {
    await interaction.deferReply(); // Allow time for searching the track

    const query = interaction.options.getString('query');
    const track = await searchSpotifyTrack(query);

    if (!track) {
      return interaction.editReply(`No results found for "${query}".`);
    }

    try {
      // Play the full song
      await playFullSong(interaction, track);

      // Create an embedded message
      const embed = new MessageEmbed()
        .setColor('#1DB954') // Spotify green color
        .setTitle(`Now Playing: ${track.name}`)
        .setURL(track.external_urls.spotify) // Spotify track URL
        .setDescription(`**Artist:** ${track.artists.map(artist => artist.name).join(', ')}\n**Album:** ${track.album.name}`)
        .setThumbnail(track.album.images[0]?.url || '') // Album cover image
        .setFooter('Enjoy your music!', 'https://cdn-icons-png.flaticon.com/512/174/174872.png') // Spotify logo in footer
        .setTimestamp();

      // Send the embed
      interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error playing the track:', error);
      interaction.editReply('There was an error playing the track.');
    }
  },
};
