const { Schema, model } = require('mongoose');

const ticketSettingsSchema = new Schema({
  guildID: { type: String, required: true },
  managerRoles: { type: [String], default: [] }, // Roles that can manage tickets
  ticketChannel: { type: String, default: null }, // Channel where tickets are created
  transcriptChannel: { type: String, default: null }, // Channel where closed tickets are logged
  initialMessage: { type: String, default: 'Thank you for opening a ticket! Please explain your issue.' },
});

module.exports = model('TicketSettings', ticketSettingsSchema);
