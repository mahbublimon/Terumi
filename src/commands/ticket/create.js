const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
    name: 'create-ticket',
    description: 'Create a support ticket',
    async execute(interaction) {
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

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
