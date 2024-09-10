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
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'create_ticket') {
                const { handleTicketCreate } = require('../../utils/ticketHandler');
                handleTicketCreate(interaction);
            }
        }
    },
};
