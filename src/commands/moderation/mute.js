const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const hasAdminPermissions = require('../../utils/permissionCheck');
const ms = require('ms'); // For time parsing

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user for a specified duration')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration of mute (e.g., 10m, 1h)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for muting the user')
        .setRequired(true)),

  async execute(interaction) {
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason');
    let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    // Create the "Muted" role if it doesn't exist
    if (!muteRole) {
      try {
        muteRole = await interaction.guild.roles.create({
          name: 'Muted',
          color: '#555555',
          permissions: []
        });

        // Disable SEND_MESSAGES and ADD_REACTIONS for the Muted role in all channels
        interaction.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (error) {
        console.error('Error creating Muted role:', error);
        return interaction.reply({ content: 'There was an error creating the Muted role.', ephemeral: true });
      }
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (member.roles.cache.has(muteRole.id)) {
      return interaction.reply({ content: 'User is already muted.', ephemeral: true });
    }

    // Add the Muted role to the user
    await member.roles.add(muteRole);

    const embed = new EmbedBuilder()
      .setTitle('User Muted')
      .setColor(0xFF0000)
      .addFields(
        { name: 'User', value: `${user.username}`, inline: true },
        { name: 'Duration', value: duration, inline: true },
        { name: 'Reason', value: reason, inline: true }
      );

    const replyMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    // Automatically unmute after the specified duration
    setTimeout(async () => {
      if (member.roles.cache.has(muteRole.id)) {
        await member.roles.remove(muteRole);
        await member.send('You have been unmuted.');
      }
    }, ms(duration));

    // Delete the command message after 10 seconds
    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 10000);
  },
};
