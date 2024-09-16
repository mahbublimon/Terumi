const { Player } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spotifyApi = require('./spotifyClient'); // Import the Spotify API client

module.exports = (client) => {
    // Initialize the Discord player
    const player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }
    });

    // Function to search for a track on Spotify
    async function searchSpotifyTrack(query) {
        try {
            const result = await spotifyApi.searchTracks(query);
            const track = result.body.tracks.items[0]; // Get the first track result
            return track || null;
        } catch (error) {
            console.error('Error fetching track from Spotify:', error);
            return null;
        }
    }

    // Function to play a Spotify track in a voice channel
    async function playSpotifyTrack(interaction, trackInfo) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const audioPlayer = createAudioPlayer();
        const resource = createAudioResource(trackInfo.preview_url); // Spotify preview URL
        audioPlayer.play(resource);
        connection.subscribe(audioPlayer);

        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        const embed = new EmbedBuilder()
            .setTitle('🎶 Now Playing')
            .setDescription(`**[${trackInfo.name}](${trackInfo.external_urls.spotify})** by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
            .setThumbnail(trackInfo.album.images[0].url)
            .setColor('#1DB954'); // Spotify green color

        await interaction.reply({ embeds: [embed] });
    }

    return { searchSpotifyTrack, playSpotifyTrack, player }; // Export the necessary functions
};
