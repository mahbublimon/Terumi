const User = require('../../models/User');

module.exports = {
    name: 'profile',
    description: 'Shows the profile of a user',
    async execute(interaction) {
        const user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            return interaction.reply('No profile found.');
        }

        await interaction.reply(`Profile for ${interaction.user.username}:\nLevel: ${user.level}\nExperience: ${user.experience}`);
    }
};
