const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const autoAssign = require('../../utils/autoAssign');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll-ticket')
    .setDescription('Reroll the ticket to another support staff'),

  async execute(interaction) {
    const channel = interaction.channel;

    const ticket = await Ticket.findOne({ channelID: channel.id });
    
    if (!ticket) {
      return interaction.reply({ content: 'This is not a valid ticket channel.', ephemeral: true });
    }

    // Assign a new support staff
    const newSupport = await autoAssign.assignSupport();

    // Update the ticket with the new support staff
    ticket.supportID = newSupport.id;
    await ticket.save();

    // Update channel permissions to reflect the new support staff
    await channel.permissionOverwrites.edit(newSupport.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    // Notify the channel
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Rerolled`)
      .setDescription(`The ticket has been reassigned to ${newSupport.tag}.`)
      .setColor('YELLOW');

    await channel.send({ embeds: [embed] });
  }
};
