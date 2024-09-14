const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const TicketSettings = require('../../models/TicketSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-manager-role')
    .setDescription('Set or update roles that can manage tickets')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('Role that can manage tickets')
        .setRequired(true)
    ),
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

    const embed = new EmbedBuilder()
      .setColor('GREEN')
      .setTitle('Ticket Manager Role Updated')
      .setDescription(`The role **${role.name}** can now manage tickets.`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
