const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const premiumHandler = require('../../utils/premiumHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to a premium plan')
    .addStringOption(option => 
      option.setName('tier')
        .setDescription('Choose a tier (standard, premium, custom)')
        .setRequired(true)
        .addChoices(
          { name: 'Standard', value: 'standard' },
          { name: 'Premium', value: 'premium' },
          { name: 'Custom', value: 'custom' }
        )
    )
    .addStringOption(option => 
      option.setName('subscription_type')
        .setDescription('Choose subscription type (monthly, yearly)')
        .setRequired(true)
        .addChoices(
          { name: 'Monthly', value: 'monthly' },
          { name: 'Yearly', value: 'yearly' }
        )
    ),

  async execute(interaction) {
    const tier = interaction.options.getString('tier');
    const subscriptionType = interaction.options.getString('subscription_type');
    const userID = interaction.user.id;
    const guildID = interaction.guild.id;

    // Mock payment (assume success)
    const paymentSuccessful = true; // Replace with actual payment logic

    if (paymentSuccessful) {
      await premiumHandler.subscribeUser(userID, guildID, tier, subscriptionType);

      const embed = new EmbedBuilder()
        .setColor('GREEN')
        .setTitle('Subscription Successful!')
        .setDescription(`You have successfully subscribed to the **${tier}** plan (${subscriptionType}).`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      return interaction.reply({ content: 'Subscription failed. Please try again.', ephemeral: true });
    }
  },
};
