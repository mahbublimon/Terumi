const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing to skip!', ephemeral: true });
    }

    queue.skip();
    return interaction.reply({ content: '⏭ Song skipped!' });
  },
};
