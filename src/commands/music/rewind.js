const { SlashCommandBuilder } = require('@discordjs/builders'); // Add this import
const player = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rewind')
    .setDescription('Rewind the current song by a specified amount of seconds')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('The number of seconds to rewind')
        .setRequired(true)
    ),

  async execute(interaction) {
    const queue = player.getQueue(interaction.guild.id);
    const seconds = interaction.options.getInteger('seconds');

    if (!queue || !queue.playing) {
      return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
    }

    const currentTime = queue.currentTime;
    const rewindTime = Math.max(currentTime - seconds * 1000, 0);

    queue.seek(rewindTime);
    return interaction.reply({ content: `⏪ Rewound by ${seconds} seconds!` });
  },
};
