const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userID: { type: String, required: true },        // The ID of the user who created the ticket
  supportID: { type: String, default: null },      // The ID of the support staff assigned to the ticket
  channelID: { type: String, required: true },     // The ID of the Discord channel where the ticket is discussed
  status: { type: String, enum: ['open', 'closed'], default: 'open' }, // Status of the ticket (open/closed)
  issue: { type: String, required: true },         // The issue or description provided by the user
  createdAt: { type: Date, default: Date.now },    // Date when the ticket was created
  closedAt: { type: Date, default: null },         // Date when the ticket was closed (if closed)
  transcript: { type: Array, default: [] },        // Stores ticket conversation for archiving (encrypted)
});

module.exports = mongoose.model('Ticket', ticketSchema);
