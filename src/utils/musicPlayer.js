const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    async playSong(guild, songName) {
        const voiceChannel = guild.me.voice.channel;
        if (!voiceChannel) {
            throw new Error('Bot is not in a voice channel');
        }

        const player = createAudioPlayer();
        const resource = createAudioResource(`./songs/${songName}.mp3`);  // Assuming you have song files

        player.play(resource);
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        connection.subscribe(player);
    }
};
