// src/commands/misc/reminder.js
const { MessageEmbed } = require('discord.js');
const ms = require('ms'); // For parsing time (like '24h' or '1d')

const reminders = new Map(); // Store reminders in memory (consider using a database in production)

module.exports = {
  data: {
    name: 'reminder',
    description: 'Set a reminder',
    options: [
      {
        name: 'time',
        type: 'STRING',
        description: 'Time after which the reminder will trigger (e.g., 1h, 30m)',
        required: true,
      },
      {
        name: 'message',
        type: 'STRING',
        description: 'What you want to be reminded about',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const time = interaction.options.getString('time');
    const reminderMessage = interaction.options.getString('message');
    const user = interaction.user;

    const timeMs = ms(time);
    if (!timeMs) {
      return interaction.reply({ content: 'Invalid time format! Use something like "1h" or "30m".', ephemeral: true });
    }

    // Save the reminder in memory
    reminders.set(user.id, { reminderMessage, timeMs, createdAt: Date.now() });

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Reminder Set')
      .setDescription(`I'll remind you in **${time}** about: **${reminderMessage}**`)
      .setFooter('Make sure DMs are enabled so I can message you!')
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });

    // Set the reminder to DM the user after the specified time
    setTimeout(() => {
      user.send(`⏰ Reminder: ${reminderMessage}`);
      reminders.delete(user.id); // Remove the reminder after sending
    }, timeMs);
  },
};
