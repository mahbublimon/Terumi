import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Shows the avatar of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the avatar of")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const embed = new MessageEmbed()
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }));

    await interaction.reply({ embeds: [embed] });
  },
};
