import { EmbedBuilder } from "discord.js";

export default {
  name: "giveaway-create",
  description: "Create a giveaway",
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Giveaway Created")
      .setDescription("A giveaway has been created!")
      .setColor(0x00ff00);

    await interaction.reply({ embeds: [embed] });
  },
};
