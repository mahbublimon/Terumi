const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const spotifyApi = require('../../utils/spotifyClient'); // Spotify client
const player = require('../../utils/musicPlayer'); // YouTube/Discord player for full track playback
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify or YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song title, Spotify URL, or YouTube URL')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('fulltrack')
        .setDescription('Whether to play the full track via YouTube (default: preview only)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const fullTrack = interaction.options.getBoolean('fulltrack') || false;
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
    }

    // If the user requests a full track, search for it on YouTube
    if (fullTrack) {
      const queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
      });

      try {
        if (!queue.connection) await queue.connect(voiceChannel);
      } catch (error) {
        queue.destroy();
        console.error(error);
        return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
      }

      // Search for the full track on YouTube using discord-player
      const track = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO, // AUTO will pick YouTube or SoundCloud
      }).then(x => x.tracks[0]);

      if (!track) {
        return interaction.reply({ content: `No results found for "${query}" on YouTube!`, ephemeral: true });
      }

      queue.addTrack(track);
      if (!queue.playing) await queue.play();

      const playEmbed = new EmbedBuilder()
        .setTitle('🎶 Now Playing')
        .setDescription(`**[${track.title}](${track.url})**`)
        .setColor('#FF0000'); // YouTube's Red

      return interaction.reply({ embeds: [playEmbed] });
    }

    // If preview-only, use Spotify to search and play the preview
    const track = await spotifyApi.searchSpotifyTrack(query);

    if (!track || !track.preview_url) {
      return interaction.reply({ content: `No preview available for "${query}" on Spotify.`, ephemeral: true });
    }

    // Play the 30-second preview
    await player.play(interaction, track.preview_url, track);
  },
};
