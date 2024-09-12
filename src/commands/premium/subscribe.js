// src/commands/premium/subscribe.js
const premiumHandler = require('../../utils/premiumHandler');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'subscribe',
    description: 'Subscribe to a premium plan',
    options: [
      {
        name: 'tier',
        type: 'STRING',
        description: 'Choose a tier (standard, premium, custom)',
        required: true,
        choices: [
          { name: 'Standard', value: 'standard' },
          { name: 'Premium', value: 'premium' },
          { name: 'Custom', value: 'custom' },
        ],
      },
      {
        name: 'subscription_type',
        type: 'STRING',
        description: 'Choose subscription type (monthly, yearly)',
        required: true,
        choices: [
          { name: 'Monthly', value: 'monthly' },
          { name: 'Yearly', value: 'yearly' },
        ],
      },
    ],
  },
  async execute(interaction) {
    const tier = interaction.options.getString('tier');
    const subscriptionType = interaction.options.getString('subscription_type');
    const userID = interaction.user.id;
    const guildID = interaction.guild.id;

    // Mock payment (assume success)
    const paymentSuccessful = true; // Replace with actual payment logic

    if (paymentSuccessful) {
      await premiumHandler.subscribeUser(userID, guildID, tier, subscriptionType);

      const embed = new MessageEmbed()
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
