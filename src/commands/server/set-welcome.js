const { SlashCommandBuilder, ChannelType } = require('discord.js');
const WelcomeConfig = require('../../models/WelcomeConfig'); // Assuming a MongoDB schema

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-welcome')
    .setDescription('Set the custom welcome message for new users')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the welcome message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the welcome message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('The URL of the thumbnail image for the welcome message')
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where the welcome message should be sent')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const thumbnail = interaction.options.getString('thumbnail') || null;
    const channel = interaction.options.getChannel('channel');

    // Store welcome message settings in the database
    const welcomeConfig = await WelcomeConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { title, description, thumbnail, channelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: 'Welcome message configuration saved!', ephemeral: true });
  },
};
