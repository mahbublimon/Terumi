// src/commands/server/dashboard.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'dashboard',
    description: 'Get a direct link to your server dashboard',
  },
  async execute(interaction) {
    const dashboardLink = `http://yourdashboardurl.com/${interaction.guild.id}`;

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Server Dashboard')
      .setDescription(`Here is your dashboard link: [Dashboard](${dashboardLink})`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
