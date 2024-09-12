// src/commands/misc/ping.js
module.exports = {
  data: {
    name: 'ping',
    description: 'Check Terumi’s latency',
  },
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    return interaction.editReply(`Pong! Latency: ${latency}ms`);
  },
};
