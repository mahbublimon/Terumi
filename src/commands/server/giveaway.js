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
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    const durationMs = ms(duration); // Convert duration to milliseconds

    // Check if the duration was parsed correctly
    if (!durationMs || durationMs <= 0) {
      return interaction.reply({ content: 'Invalid duration format. Please use a format like `3d`, `2h`, or `30m`.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold) // Use predefined color constant
      .setTitle('🎉 **Giveaway!** 🎉')
      .setDescription(`**Prize**: ${prize}\n**Number of Winners**: ${winners}\n**Duration**: ${duration}`)
      .setFooter({ text: 'React with 🎉 to enter!' })
      .setTimestamp(Date.now() + durationMs); // Show the time when the giveaway ends

    // Send the giveaway message
    const giveawayMessage = await channel.send({ embeds: [embed] });
    giveawayMessage.react('🎉'); // React with 🎉 emoji

    // Wait for the specified duration, then pick winners
    setTimeout(async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');

      if (!reaction) {
        return channel.send('No one reacted to the giveaway!');
      }

      const users = await reaction.users.fetch();
      const eligibleUsers = users.filter(user => !user.bot); // Filter out bots

      if (eligibleUsers.size === 0) {
        return channel.send('No participants for the giveaway.');
      }

      // Randomly select the winners
      const winnersList = eligibleUsers.random(winners);

      // Create the result embed
      const resultEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('🎉 **Giveaway Winners** 🎉')
        .setDescription(`Congratulations to ${winnersList.map(user => user.toString()).join(', ')}! You won **${prize}**!`);

      channel.send({ embeds: [resultEmbed] });
    }, durationMs);

    // Reply to the interaction
    return interaction.reply({ content: `Giveaway for **${prize}** has started in ${channel}!`, ephemeral: true });
  },
};
