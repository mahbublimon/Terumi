const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        .setDescription('The duration of the giveaway (e.g., 3d)')
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

    const embed = new EmbedBuilder()
      .setColor('GOLD')
      .setTitle('🎉 Giveaway!')
      .setDescription(`**Prize**: ${prize}\n**Winners**: ${winners}\n**Duration**: ${duration}`)
      .setFooter({ text: 'React with 🎉 to enter!' })
      .setTimestamp();

    const giveawayMessage = await channel.send({ embeds: [embed] });
    giveawayMessage.react('🎉');

    setTimeout(async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const winnersList = users.filter(user => !user.bot).random(winners);

      const resultEmbed = new EmbedBuilder()
        .setColor('GREEN')
        .setTitle('🎉 Giveaway Winners')
        .setDescription(`Congratulations to ${winnersList.map(user => user.toString()).join(', ')}! You won **${prize}**!`);

      channel.send({ embeds: [resultEmbed] });
    }, ms(duration));

    return interaction.reply({ content: `Giveaway for **${prize}** created in ${channel}!`, ephemeral: true });
  },
};
