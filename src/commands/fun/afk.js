import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your status as AFK")
    .addStringOption((option) =>
      option.setName("message").setDescription("AFK message").setRequired(true),
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message");
    interaction.client.afkMap.set(interaction.user.id, message);

    await interaction.reply(`You are now AFK: ${message}`);
  },
};
