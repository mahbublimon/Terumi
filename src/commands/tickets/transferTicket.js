const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer-ticket')
    .setDescription('Transfer the ticket to another support staff')
    .addUserOption(option => 
      option.setName('support')
        .setDescription('The support staff to transfer the ticket to')
        .setRequired(true)),

  async execute(interaction) {
    const newSupport = interaction.options.getUser('support');
    const channel = interaction.channel;

    const ticket = await Ticket.findOne({ channelID: channel.id });
    
    if (!ticket) {
      return interaction.reply({ content: 'This is not a valid ticket channel.', ephemeral: true });
    }

    // Update the ticket with the new support staff
    ticket.supportID = newSupport.id;
    await ticket.save();

    // Update channel permissions to reflect the new support staff
    await channel.permissionOverwrites.edit(newSupport.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    // Notify in the channel
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Transferred`)
      .setDescription(`The ticket has been transferred to ${newSupport.tag}.`)
      .setColor('BLUE');

    await channel.send({ embeds: [embed] });
  }
};
