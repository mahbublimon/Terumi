const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const tracks = queue.tracks.map((track, i) => `${i + 1}. **${track.title}** (${track.duration})`).join('\n');
    
    const queueEmbed = new EmbedBuilder()
      .setTitle('🎶 Current Queue')
      .setDescription(tracks)
      .setColor('BLUE');

    return interaction.reply({ embeds: [queueEmbed] });
  },
};
