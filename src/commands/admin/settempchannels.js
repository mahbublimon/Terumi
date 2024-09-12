const { SlashCommandBuilder } = require('discord.js');
const TemporaryChannelSettings = require('../../models/TemporaryChannelSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settempchannels')
    .setDescription('Set up temporary voice channel settings')
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('Category where temporary channels will be created')
        .addChannelTypes(['GUILD_CATEGORY'])
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('create_channel')
        .setDescription('The channel members join to create a temporary channel')
        .addChannelTypes(['GUILD_VOICE'])
        .setRequired(true))
    .addStringOption(option =>
      option.setName('channel_name_template')
        .setDescription('Template for the name of the created channels (use {user.name})')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('user_limit')
        .setDescription('User limit for temporary channels (0 for no limit)')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
    }

    const category = interaction.options.getChannel('category');
    const createChannel = interaction.options.getChannel('create_channel');
    const channelNameTemplate = interaction.options.getString('channel_name_template') || "{user.name}'s Channel";
    const userLimit = interaction.options.getInteger('user_limit') || 0;

    let settings = await TemporaryChannelSettings.findOne({ guildID: interaction.guild.id });

    if (!settings) {
      settings = new TemporaryChannelSettings({ guildID: interaction.guild.id });
    }

    settings.categoryID = category.id;
    settings.createChannelID = createChannel.id;
    settings.channelNameTemplate = channelNameTemplate;
    settings.userLimit = userLimit;

    await settings.save();

    await interaction.reply(`Temporary channel settings updated successfully!`);
  },
};
