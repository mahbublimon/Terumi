import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ban").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban"),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply("You do not have permission to ban members.");
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply("User is not in the server.");

    await member.ban({ reason });
    await interaction.reply(`${user.tag} has been banned for ${reason}.`);
  },
};
