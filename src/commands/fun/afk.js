// src/commands/fun/afk.js
const afkUsers = new Map();

module.exports = {
  data: {
    name: 'afk',
    description: 'Set your AFK status',
    options: [
      {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for being AFK',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    afkUsers.set(interaction.user.id, { reason, timestamp: Date.now() });

    await interaction.reply(`${interaction.user.username} is now AFK: ${reason}`);
  },
};

// Check for mentions in messageCreate event
module.exports = async (client, message) => {
  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach((user) => {
      if (afkUsers.has(user.id)) {
        const afkData = afkUsers.get(user.id);
        message.reply(`${user.username} is currently AFK: ${afkData.reason}`);
      }
    });
  }

  if (afkUsers.has(message.author.id)) {
    afkUsers.delete(message.author.id);
    message.reply(`Welcome back, ${message.author.username}. AFK status removed.`);
  }
};
