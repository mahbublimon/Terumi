import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song URL or name")
        .setRequired(true),
    ),
  async execute(interaction) {
    const song = interaction.options.getString("song");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply(
        "You need to be in a voice channel to play music!",
      );

    const connection = await voiceChannel.join();
    const stream = ytdl(song, { filter: "audioonly" });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    await interaction.reply(`Now playing: ${song}`);
  },
};
