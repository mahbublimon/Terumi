const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const WelcomeConfig = require('../../models/WelcomeConfig'); // Assuming MongoDB schema

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-preview')
    .setDescription('Preview the current welcome message')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to preview the welcome message for')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const welcomeConfig = await WelcomeConfig.findOne({ guildId: interaction.guild.id });

    if (!welcomeConfig) {
      return interaction.reply({ content: 'No welcome message configuration found.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('YELLOW')
      .setTitle(welcomeConfig.title || 'Welcome!')
      .setDescription(welcomeConfig.description.replace('{{username}}', user.username))
      .setThumbnail(welcomeConfig.thumbnail || user.displayAvatarURL())
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
