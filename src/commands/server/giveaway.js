const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js'); // Use Colors for predefined color constants
const ms = require('ms'); // For handling giveaway duration

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
    const title = interaction.options.getString('title'); // Custom title
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    const durationMs = ms(duration); // Convert duration to milliseconds
    const host = interaction.user; // The person who starts the giveaway

    // Check if the duration was parsed correctly
    if (!durationMs || durationMs <= 0) {
      return interaction.reply({ content: 'Invalid duration format. Please use a format like `3d`, `2h`, or `30m`.', ephemeral: true });
    }

    // Initial embed with 0 entries
    const embed = new EmbedBuilder()
      .setColor(Colors.Gold) // Use predefined color constant
      .setTitle(`🎉 **${title}** 🎉`) // Custom title from user input
      .setDescription(
        `**Prize**: ${prize}\n` +
        `**Number of Winners**: ${winners}\n` +
        `**Duration**: ${duration}\n` +
        `**Entries**: 0\n` +  // Initial entries count set to 0
        `**Hosted by**: ${host}`
      )
      .setFooter({ text: 'React with 🎉 to enter!' })
      .setTimestamp(Date.now() + durationMs); // Show the time when the giveaway ends

    // Send the giveaway message and add reaction
    const giveawayMessage = await channel.send({ embeds: [embed] });
    giveawayMessage.react('🎉'); // React with 🎉 emoji

    // Track users who react to the giveaway
    const filter = (reaction, user) => {
      return reaction.emoji.name === '🎉' && !user.bot; // Only count real users
    };

    const collector = giveawayMessage.createReactionCollector({ filter, time: durationMs });

    // Update the embed with the new entries count dynamically
    collector.on('collect', async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const eligibleUsers = users.filter(user => !user.bot); // Filter out bots
      const entryCount = eligibleUsers.size;

      // Edit the message to update the entries count
      const updatedEmbed = new EmbedBuilder()
        .setColor(Colors.Gold)
        .setTitle(`🎉 **${title}** 🎉`)
        .setDescription(
          `**Prize**: ${prize}\n` +
          `**Number of Winners**: ${winners}\n` +
          `**Duration**: ${duration}\n` +
          `**Entries**: ${entryCount}\n` +  // Update the entries count
          `**Hosted by**: ${host}`
        )
        .setFooter({ text: 'React with 🎉 to enter!' })
        .setTimestamp(Date.now() + durationMs); // Keep the original timestamp

      // Edit the original message with the new embed
      giveawayMessage.edit({ embeds: [updatedEmbed] });
    });

    // After the giveaway ends, pick the winners
    collector.on('end', async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');

      if (!reaction) {
        return channel.send('No one reacted to the giveaway!');
      }

      const users = await reaction.users.fetch();
      const eligibleUsers = users.filter(user => !user.bot); // Filter out bots
      const entryCount = eligibleUsers.size; // Final count of entries

      if (entryCount === 0) {
        return channel.send('No participants for the giveaway.');
      }

      // Randomly select the winners
      const winnersList = eligibleUsers.random(winners);

      // Create the result embed
      const resultEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(`🎉 **${title} - Winners** 🎉`) // Show the custom title in the winner announcement
        .setDescription(
          `Congratulations to ${winnersList.map(user => user.toString()).join(', ')}! ` +
          `You won **${prize}**!\n\n`
        );

      // Send the result embed
      channel.send({ embeds: [resultEmbed] });
    });

    // Reply to the interaction
    return interaction.reply({ content: `Giveaway for **${prize}** has started in ${channel}!`, ephemeral: true });
  },
};
