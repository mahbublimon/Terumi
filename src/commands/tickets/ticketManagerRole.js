// src/commands/tickets/ticketManagerRole.js
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: {
    name: 'ticket-manager-role',
    description: 'Set or update roles that can manage tickets',
    options: [
      {
        name: 'role',
        type: 'ROLE',
        description: 'Role that can manage tickets',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    let settings = await TicketSettings.findOne({ guildID: interaction.guild.id });
    if (!settings) {
      settings = new TicketSettings({ guildID: interaction.guild.id });
    }

    if (settings.managerRoles.includes(role.id)) {
      return interaction.reply({ content: 'This role is already a ticket manager!', ephemeral: true });
    }

    settings.managerRoles.push(role.id);
    await settings.save();

    return interaction.reply({ content: `The role **${role.name}** can now manage tickets.`, ephemeral: true });
  },
};
