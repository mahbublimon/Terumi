import { SlashCommandBuilder } from "@discordjs/builders";
import User from "../../models/User.js";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Shows your profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User profile to view")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const userData = await User.findOne({ userId: user.id });

    if (!userData) {
      return interaction.reply(`${user.username} has no profile yet!`);
    }

    return interaction.reply({
      content: `**${user.username}'s Profile:**\nLevel: ${userData.level}\nXP: ${userData.xp}`,
    });
  },
};
