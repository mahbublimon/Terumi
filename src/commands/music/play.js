const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchSpotifyTrack, playSpotifyTrack } = require('../../utils/musicPlayer')(require('../../../bot')); // Import from musicPlayer.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from Spotify')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The name of the song or artist')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');

        try {
            // Search for the track on Spotify
            const trackInfo = await searchSpotifyTrack(query);

            if (!trackInfo) {
                return interaction.reply({ content: 'No results found on Spotify for your query!', ephemeral: true });
            }

            // Play the track in the user's voice channel
            await playSpotifyTrack(interaction, trackInfo);
        } catch (error) {
            console.error('Error playing music:', error);
            await interaction.reply({ content: 'An error occurred while trying to play the music.', ephemeral: true });
        }
    }
};
