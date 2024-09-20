const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js'); // Use Colors for predefined color constants
const ms = require('ms'); // For handling giveaway duration

// Store the giveaway message IDs to allow rerolling later
let giveaways = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Create a new giveaway')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('The channel for the giveaway')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('title')
        .setDescription('The title of the giveaway') // Added a custom title option
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('The duration of the giveaway (e.g., 3d, 2h, 30m)')
        .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName('winners')
        .setDescription('The number of winners')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('prize')
        .setDescription('The prize for the giveaway')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    const durationMs = ms(duration);
    const host = interaction.user;

    if (!durationMs || durationMs <= 0) {
      return interaction.reply({ content: 'Invalid duration format. Please use a format like `3d`, `2h`, or `30m`.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle(`🎉 **${title}** 🎉`)
      .setDescription(
        `**Number of Winners**: ${winners}\n` +
        `**Ends in**: ${duration}\n` +
        `**Hosted by**: ${host}\n` +
        `**Entries**: 0`
      )
      .setFooter({ text: 'React with 🎉 to enter!' })
      .setTimestamp(Date.now() + durationMs);

    const giveawayMessage = await channel.send({ embeds: [embed] });
    giveawayMessage.react('🎉');

    let entryCount = 0;

    const filter = (reaction, user) => {
      return reaction.emoji.name === '🎉' && !user.bot;
    };

    const collector = giveawayMessage.createReactionCollector({ filter, time: durationMs });

    collector.on('collect', async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const eligibleUsers = users.filter(user => !user.bot);
      entryCount = eligibleUsers.size;

      const updatedEmbed = new EmbedBuilder()
        .setColor(Colors.Gold)
        .setTitle(`🎉 **${title}** 🎉`)
        .setDescription(
          `**Number of Winners**: ${winners}\n` +
          `**Ends in**: ${duration}\n` +
          `**Hosted by**: ${host}\n` +
          `**Entries**: ${entryCount}`
        )
        .setFooter({ text: 'React with 🎉 to enter!' })
        .setTimestamp(Date.now() + durationMs);

      giveawayMessage.edit({ embeds: [updatedEmbed] });
    });

    collector.on('end', async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const eligibleUsers = users.filter(user => !user.bot);
      entryCount = eligibleUsers.size;

      if (entryCount === 0) {
        return channel.send('No participants for the giveaway.');
      }

      const winnersList = eligibleUsers.random(winners);
      const resultEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(`🎉 **${title} - Winners** 🎉`)
        .setDescription(
          `**Number of Winners**: ${winners}\n` +
          `**Ended**\n` +
          `**Hosted by**: ${host}\n` +
          `**Entries**: ${entryCount}\n\n` +
          `**Winners**: ${winnersList.map(user => user.toString()).join(', ')}`
        );

      channel.send({ embeds: [resultEmbed] });

      // Store the giveaway message ID for future rerolls
      giveaways.set(giveawayMessage.id, { eligibleUsers, winners, prize, title });
    });

    return interaction.reply({ content: `Giveaway for **${prize}** has started in ${channel}!`, ephemeral: true });
  },
};
