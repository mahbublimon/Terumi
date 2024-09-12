const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

const reminders = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Set a reminder')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Time after which the reminder will trigger (e.g., 1h, 30m)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('What you want to be reminded about')
        .setRequired(true)),

  async execute(interaction) {
    const time = interaction.options.getString('time');
    const reminderMessage = interaction.options.getString('message');
    const user = interaction.user;

    const timeMs = ms(time);
    if (!timeMs) {
      return interaction.reply({ content: 'Invalid time format! Use something like "1h" or "30m".', ephemeral: true });
    }

    reminders.set(user.id, { reminderMessage, timeMs, createdAt: Date.now() });

    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Reminder Set')
      .setDescription(`I'll remind you in **${time}** about: **${reminderMessage}**`)
      .setFooter('Make sure DMs are enabled so I can message you!')
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });

    setTimeout(() => {
      user.send(`⏰ Reminder: ${reminderMessage}`);
      reminders.delete(user.id);
    }, timeMs);
  },
};
