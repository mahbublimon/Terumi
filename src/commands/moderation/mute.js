module.exports = {
    name: 'mute',
    description: 'Mute a user',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to mute',
            required: true,
        },
        {
            name: 'duration',
            type: 'STRING',
            description: 'Duration of the mute',
            required: true,
        },
    ],
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const member = await interaction.guild.members.fetch(user.id);

        await member.timeout(duration * 60 * 1000);
        await interaction.reply(`${user.tag} has been muted for ${duration} minutes.`);
    },
};
