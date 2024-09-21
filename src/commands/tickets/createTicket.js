const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Ticket = require('../../models/Ticket');
const { assignSupport } = require('../../utils/autoAssign');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket')
    .setDescription('Creates a new support ticket')
    .addStringOption(option => 
      option.setName('issue')
        .setDescription('Describe your issue')
        .setRequired(true)
    ),
    
  async execute(interaction) {
    const { user, guild } = interaction;
    const issue = interaction.options.getString('issue');

    // Auto-assign support member
    let assignedSupport;
    try {
      assignedSupport = await assignSupport();
    } catch (error) {
      return interaction.reply({ content: 'No support staff available at the moment. Please try again later.', ephemeral: true });
    }

    // Create a private channel for the ticket
    const channel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: 0, // 0 is for text channels
      permissionOverwrites: [
        {
          id: user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: assignedSupport.userID,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    // Save ticket to the database
    const ticket = new Ticket({
      userID: user.id,
      supportID: assignedSupport.userID,
      channelID: channel.id,
      issue: issue,
    });
    await ticket.save();

    // Send ticket creation message
    const embed = new EmbedBuilder()
      .setColor('YELLOW')
      .setTitle(`Ticket Created: ${issue}`)
      .setDescription(`Support Staff: <@${assignedSupport.userID}>\nTicket created by <@${user.id}>`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `Ticket created in <#${channel.id}>`, ephemeral: true });
  },
};
