import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Creates a ticket system message"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle("Support Tickets")
      .setDescription("Click the button below to create a ticket.");

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("create_ticket")
        .setLabel("Create Ticket")
        .setStyle("PRIMARY"),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
