const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const autoAssign = require('../../utils/autoAssign');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket')
    .setDescription('Create a support ticket')
    .addStringOption(option => 
      option.setName('issue')
        .setDescription('Describe the issue')
        .setRequired(true)),
  
  async execute(interaction) {
    const issue = interaction.options.getString('issue');
    const member = interaction.member;

    // Create a new ticket entry in the database
    const ticket = await Ticket.create({
      userID: member.id,
      issue: issue,
      status: 'open'
    });

    // Assign a support team member using auto-assign logic
    const supportMember = await autoAssign.assignSupport();

    // Create a private channel for the ticket
    const channel = await interaction.guild.channels.create(`ticket-${ticket.id}`, {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ['VIEW_CHANNEL'] },  // Public can't view
        { id: member.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },  // User can view
        { id: supportMember.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }  // Assigned staff
      ]
    });

    // Send a message to the newly created channel
    const embed = new EmbedBuilder()
      .setTitle(`Ticket #${ticket.id} Created`)
      .setDescription(`Issue: ${issue}\nAssigned to: ${supportMember.user.tag}`)
      .setColor('GREEN');
      
    await channel.send({ embeds: [embed] });
    interaction.reply({ content: `Your ticket has been created and assigned to ${supportMember.user.tag}.`, ephemeral: true });
  }
};
