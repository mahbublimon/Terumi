const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const { handleTicketCreate } = require('../../utils/ticketHandler');

module.exports = {
    name: 'create-ticket',
    description: 'Create a new support ticket',
    async execute(interaction) {
        const userId = interaction.user.id;

        // Check if the user already has an open ticket
        const existingTicket = await Ticket.findOne({ userId, status: 'open' });
        if (existingTicket) {
            return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Support Ticket')
            .setDescription('Click the button below to create a ticket.')
            .setColor('#00FF00');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Create Ticket')
                .setStyle('PRIMARY')
        );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        // Handle the ticket creation in the background
        handleTicketCreate(interaction);
    },
};
