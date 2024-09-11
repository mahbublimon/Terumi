// src/commands/admin/settempchannels.js
const TemporaryChannelSettings = require('../../models/TemporaryChannelSettings');

module.exports = {
  data: {
    name: 'settempchannels',
    description: 'Set up temporary voice channel settings',
    options: [
      {
        name: 'category',
        type: 'CHANNEL',
        description: 'Category where temporary channels will be created',
        channelTypes: ['GUILD_CATEGORY'],
        required: true,
      },
      {
        name: 'create_channel',
        type: 'CHANNEL',
        description: 'The channel members join to create a temporary channel',
        channelTypes: ['GUILD_VOICE'],
        required: true,
      },
      {
        name: 'channel_name_template',
        type: 'STRING',
        description: 'Template for the name of the created channels (use {user.name})',
        required: false,
      },
      {
        name: 'user_limit',
        type: 'INTEGER',
        description: 'User limit for temporary channels (0 for no limit)',
        required: false,
      },
    ],
  },
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
