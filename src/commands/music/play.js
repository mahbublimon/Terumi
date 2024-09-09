const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { playSong } = require('../../utils/musicPlayer');

module.exports = {
    name: 'play',
    description: 'Play a song',
    options: [
        {
            name: 'song',
            type: 'STRING',
            description: 'The song to play',
            required: true,
        },
    ],
    async execute(interaction) {
        const song = interaction.options.getString('song');
        await playSong(song, interaction.guild);

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(song)
            .setColor('#0099ff');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('pause').setLabel('Pause').setStyle('PRIMARY'),
                new ButtonBuilder().setCustomId('skip').setLabel('Skip').setStyle('DANGER')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
