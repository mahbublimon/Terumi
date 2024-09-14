const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'welcome',
    description: 'Preview the welcome message for a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to preview the welcome message for',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const embed = new EmbedBuilder()
      .setColor('YELLOW')
      .setTitle('Welcome Message Preview')
      .setDescription(`Welcome, **${user.username}** to the server! We hope you enjoy your stay! 🎉`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
