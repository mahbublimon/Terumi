const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const WelcomeSettings = require('../../models/WelcomeSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-welcome')
    .setDescription('Set a custom welcome message for new users')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Only admins can use this command
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('The channel where the welcome message will be sent')
        .setRequired(true)
    )
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
        .setDescription('A URL for the thumbnail image (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const channelId = interaction.options.getChannel('channel').id;
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const thumbnail = interaction.options.getString('thumbnail') || null;

    // Update or create the welcome message settings for this guild
    await WelcomeSettings.findOneAndUpdate(
      { guildId },
      { channelId, title, description, thumbnail },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: 'Welcome message settings updated successfully!', ephemeral: true });
  },
};
