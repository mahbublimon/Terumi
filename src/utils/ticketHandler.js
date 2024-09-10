const Ticket = require('../models/Ticket');

module.exports = {
    async handleTicketCreate(interaction) {
        const userId = interaction.user.id;

        // Create a new ticket in the database
        const ticket = new Ticket({
            userId,
            channelId: null,  // This will be set after channel creation
        });

        // Create a new ticket channel for the user
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ],
        });

        // Update ticket with channel ID and save to database
        ticket.channelId = channel.id;
        await ticket.save();

        // Notify user in the newly created ticket channel
        await channel.send(`Welcome ${interaction.user}, a staff member will be with you shortly.`);
    }
};
