const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'giveaway-create',
    description: 'Create a giveaway',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Giveaway!')
            .setDescription('React to enter the giveaway!')
            .setColor('#FFD700');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('enter_giveaway')
                .setLabel('Enter Giveaway')
                .setStyle('SUCCESS')
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
