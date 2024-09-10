module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to kick',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'Reason for the kick',
            required: false
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id);
        if (!member.kickable) return interaction.reply('I cannot kick this user.');

        await member.kick(reason);
        await interaction.reply(`${user.username} has been kicked for: ${reason}`);
    }
};
