const { playSong } = require('../../utils/musicPlayer');

module.exports = {
    name: 'play',
    description: 'Play a song',
    options: [
        {
            name: 'song',
            type: 'STRING',
            description: 'The name of the song to play',
            required: true,
        }
    ],
    async execute(interaction) {
        const songName = interaction.options.getString('song');
        await playSong(interaction.guild, songName);
        await interaction.reply(`Now playing: ${songName}`);
    }
};
