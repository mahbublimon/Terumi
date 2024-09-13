const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const { QueryType } = require('discord-player');
const player = require('../../utils/musicPlayer');
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

    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel to play music!', ephemeral: true });
    }

    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });

    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();
      return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
    }

    const track = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    }).then(x => x.tracks[0]);

    if (!track) {
      return interaction.reply({ content: `No results found for ${query}!`, ephemeral: true });
    }

    queue.addTrack(track);
    if (!queue.playing) await queue.play();

    const playEmbed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`**${track.title}**`)
      .setURL(track.url)
      .setColor('GREEN');

    return interaction.reply({ embeds: [playEmbed] });
  },
};
