const Ticket = require('../models/Ticket');

module.exports = {
    async handleTicketCreate(interaction) {
        const userId = interaction.user.id;
        const existingTicket = await Ticket.findOne({ userId });

        if (existingTicket) {
            return interaction.reply('You already have an open ticket.');
        }

        const newTicket = new Ticket({ userId });
        await newTicket.save();

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

        await channel.send(`Welcome ${interaction.user}, a staff member will be with you shortly.`);
        await interaction.reply({ content: 'Ticket created!', ephemeral: true });
    },

    async handleTicketClose(interaction) {
        const userId = interaction.user.id;
        const ticket = await Ticket.findOneAndDelete({ userId });

        if (!ticket) return interaction.reply('No active ticket found.');

        const channel = interaction.channel;
        await channel.delete();
    }
};
