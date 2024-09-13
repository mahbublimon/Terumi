const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('Learn about Terumi Premium plans and features'),
    
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('GOLD')
      .setTitle('Terumi Premium Plans')
      .setDescription('Unlock Terumi’s full potential by subscribing to a premium plan.')
      .addFields(
        { name: 'Standard', value: '$0 / month', inline: true },
        { name: 'Premium', value: '$7 / month', inline: true },
        { name: 'Custom', value: '$10 / month', inline: true }
      )
      .addFields({
        name: 'Features', 
        value: `
          - Customization: Embed colors, ad-free.
          - Levels: Unlock multipliers, live leaderboards.
          - Server Protection: Anti-advertisement, anti-raid.
          - Giveaways: Custom countdown timers.
          - Vanity URL: Get a vanity Discord URL.
          - Music: High-quality music with advanced commands.
          - Moderation: Enhanced moderation controls.
          - Logging: Detailed voice, invite, and emoji logs.
          - Games: Unlock in-game stats and more.
          - Statistics: Live server statistics.`
      })
      .setFooter({ text: 'Subscribe with /subscribe [tier] [subscription_type]!' })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
