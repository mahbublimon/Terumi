export default {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;

      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error processing the interaction.",
          ephemeral: true,
        });
      }
    } else if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error processing your command.",
          ephemeral: true,
        });
      }
    }
  },
};
