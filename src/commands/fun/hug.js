module.exports = {
    name: 'hug',
    description: 'Hug a user!',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to hug',
            required: true,
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        await interaction.reply(`${interaction.user.username} hugged ${user.username}!`);
    }
};
