const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and clear the queue'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music to stop!', ephemeral: true });
    }

    queue.destroy();
    return interaction.reply({ content: '🛑 Music stopped and queue cleared!' });
  },
};
