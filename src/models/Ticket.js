// src/models/Ticket.js
const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  ticketID: { type: String, required: true },
  userID: { type: String, required: true },
  channelID: { type: String, required: true },
  guildID: { type: String, required: true },
  status: { type: String, default: 'open' }, // open or closed
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

module.exports = model('Ticket', ticketSchema);
