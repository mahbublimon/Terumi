const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-preview') // Changed command name to be unique
    .setDescription('Preview the welcome message for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to preview the welcome message for')
        .setRequired(true)
    ),
  
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
