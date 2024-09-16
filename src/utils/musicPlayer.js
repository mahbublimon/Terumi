const { Player } = require('discord-player'); // Import the discord-player
const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const spotifyApi = require('./spotifyClient'); // Spotify API Client

module.exports = (client) => {
    // Initialize the Discord player
    const player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }
    });

    // Event listener for track start
    player.on('trackStart', (queue, track) => {
        const nowPlayingEmbed = new EmbedBuilder()
            .setTitle('🎶 Now Playing')
            .setDescription(`[${track.title}](${track.url})`)
            .setColor('#1DB954'); // Spotify Green

        queue.metadata.channel.send({ embeds: [nowPlayingEmbed] });
    });

    // Search Spotify track function
    async function searchSpotifyTrack(query) {
        try {
            const result = await spotifyApi.searchTracks(query);
            const track = result.body.tracks.items[0];
            return track || null;
        } catch (error) {
            console.error('Error fetching track from Spotify:', error);
            return null;
        }
    }

    // Function to play Spotify tracks
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
        const resource = createAudioResource(trackInfo.preview_url); // Spotify track's preview URL
        audioPlayer.play(resource);
        connection.subscribe(audioPlayer);

        audioPlayer.on('idle', () => {
            connection.destroy();
        });

        const embed = new EmbedBuilder()
            .setTitle('🎶 Now Playing')
            .setDescription(`**[${trackInfo.name}](${trackInfo.external_urls.spotify})** by ${trackInfo.artists.map(artist => artist.name).join(', ')}`)
            .setThumbnail(trackInfo.album.images[0].url)
            .setColor('#1DB954'); // Spotify Green

        await interaction.reply({ embeds: [embed] });
    }

    // Export functions
    return { searchSpotifyTrack, playSpotifyTrack, player };
};
