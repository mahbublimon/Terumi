const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  const distube = new DisTube(client, { emitNewSongOnly: true });

  client.distube = distube;

  client.distube
    .on('playSong', (queue, song) => {
      const embed = new EmbedBuilder()
        .setTitle('Now Playing')
        .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``);
      queue.textChannel.send({ embeds: [embed] });
    })
    .on('addSong', (queue, song) => {
      const embed = new EmbedBuilder()
        .setTitle('Added to Queue')
        .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``);
      queue.textChannel.send({ embeds: [embed] });
    });
};
