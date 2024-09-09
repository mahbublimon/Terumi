const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    async playSong(song, guild) {
        const voiceChannel = guild.me.voice.channel;
        if (!voiceChannel) throw new Error('Bot is not in a voice channel!');

        const player = createAudioPlayer();
        const resource = createAudioResource(`./songs/${song}.mp3`); // Assuming local file

        player.play(resource);
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        }).subscribe(player);
    }
};
