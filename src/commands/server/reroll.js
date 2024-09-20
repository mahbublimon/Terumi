const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const giveaways = require('./giveaway').giveaways; // Import the giveaways map from the giveaway command

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll')
    .setDescription('Reroll the winners of a giveaway')
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('The message ID of the giveaway')
        .setRequired(true)
    ),

  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveawayData = giveaways.get(messageId); // Fetch the giveaway data using message ID

    if (!giveawayData) {
      return interaction.reply({ content: 'Invalid message ID or giveaway not found.', ephemeral: true });
    }

    const { eligibleUsers, winners, prize, title } = giveawayData;

    if (eligibleUsers.size === 0) {
      return interaction.reply({ content: 'No participants to reroll.', ephemeral: true });
    }

    // Randomly select new winners
    const newWinners = eligibleUsers.random(winners);

    // Create a result embed for the new winners
    const resultEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(`🎉 **${title} - Rerolled Winners** 🎉`)
      .setDescription(`**New Winners**: ${newWinners.map(user => user.toString()).join(', ')}\n\nYou won **${prize}**!`);

    // Send the result embed
    await interaction.channel.send({ embeds: [resultEmbed] });
    return interaction.reply({ content: 'Winners have been successfully rerolled!', ephemeral: true });
  },
};
