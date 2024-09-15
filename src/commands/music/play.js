const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const player = require('../../utils/musicPlayer'); // Ensure player is properly initialized in this file
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song title or URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    // Check if the user is in a voice channel
    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel to play music!', ephemeral: true });
    }

    // Create the queue for the guild
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });

    try {
      // Connect to the voice channel if not already connected
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch (err) {
      queue.destroy();
      console.error(err); // Log the error to track issues
      return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
    }

    // Search for the song using the query
    const track = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    }).then(x => x.tracks[0]);

    // If no track is found
    if (!track) {
      return interaction.reply({ content: `No results found for ${query}!`, ephemeral: true });
    }

    // Add the track to the queue
    queue.addTrack(track);
    if (!queue.playing) await queue.play();

    // Create an embed to show the now playing track
    const playEmbed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`**[${track.title}](${track.url})**`)
      .setURL(track.url)
      .setColor('#1DB954') // Use Spotify Green Hex Code for color

    return interaction.reply({ embeds: [playEmbed] });
  },
};
