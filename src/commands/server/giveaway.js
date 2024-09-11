// src/commands/server/giveaway.js
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'giveaway',
    description: 'Create a new giveaway',
    options: [
      {
        name: 'channel',
        type: 'CHANNEL',
        description: 'The channel for the giveaway',
        required: true,
      },
      {
        name: 'duration',
        type: 'STRING',
        description: 'The duration of the giveaway (e.g., 3d)',
        required: true,
      },
      {
        name: 'winners',
        type: 'INTEGER',
        description: 'The number of winners',
        required: true,
      },
      {
        name: 'prize',
        type: 'STRING',
        description: 'The prize for the giveaway',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');

    const embed = new MessageEmbed()
      .setTitle('🎉 Giveaway!')
      .setDescription(`Prize: **${prize}**\nWinners: **${winners}**\nDuration: **${duration}**`)
      .setFooter('React with 🎉 to enter!')
      .setTimestamp();

    const giveawayMessage = await channel.send({ embeds: [embed] });
    giveawayMessage.react('🎉');

    setTimeout(async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const winnersList = users.filter(user => !user.bot).random(winners);

      channel.send(`🎉 Congratulations to ${winnersList.map(user => user.toString()).join(', ')}! You won **${prize}**!`);
    }, ms(duration));

    return interaction.reply({ content: `Giveaway for **${prize}** created in ${channel}!`, ephemeral: true });
  },
};
