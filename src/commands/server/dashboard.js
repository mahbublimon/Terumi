// src/commands/server/dashboard.js
module.exports = {
  data: {
    name: 'dashboard',
    description: 'Get a direct link to your server dashboard',
  },
  async execute(interaction) {
    const dashboardLink = `http://yourdashboardurl.com/${interaction.guild.id}`;
    return interaction.reply({ content: `Here is your dashboard link: ${dashboardLink}`, ephemeral: true });
  },
};
