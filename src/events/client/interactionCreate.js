module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;
            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error handling this button interaction!', ephemeral: true });
            }
        }
    }
};
