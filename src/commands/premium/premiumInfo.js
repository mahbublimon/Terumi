// src/commands/premium/premiumInfo.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'premium',
    description: 'Learn about Terumi Premium plans and features',
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('GOLD')
      .setTitle('Terumi Premium Plans')
      .setDescription('Unlock Terumi’s full potential by subscribing to a premium plan.')
      .addField('Standard', '$0 / month', true)
      .addField('Premium', '$7 / month', true)
      .addField('Custom', '$10 / month', true)
      .addField('Features', `
        - Customization: Embed colors, ad-free.
        - Levels: Unlock multipliers, live leaderboards.
        - Server Protection: Anti-advertisement, anti-raid.
        - Giveaways: Custom countdown timers.
        - Vanity URL: Get a vanity Discord URL.
        - Music: High-quality music with advanced commands.
        - Moderation: Enhanced moderation controls.
        - Logging: Detailed voice, invite, and emoji logs.
        - Games: Unlock in-game stats and more.
        - Statistics: Live server statistics.
      `)
      .setFooter('Subscribe with /subscribe [tier] [subscription_type]!')
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
