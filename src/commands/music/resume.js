const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused song'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing to resume!', ephemeral: true });
    }

    queue.setPaused(false);
    return interaction.reply({ content: '▶️ Music resumed!' });
  },
};
