export default {
  customId: "create_ticket",
  async execute(interaction) {
    const guild = interaction.guild;
    const channel = await guild.channels.create(
      `${interaction.user.username}-ticket`,
      {
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
        ],
      },
    );

    await channel.send(
      `${interaction.user}, this is your ticket. A staff member will assist you shortly.`,
    );
    await interaction.reply({ content: "Ticket created.", ephemeral: true });
  },
};
