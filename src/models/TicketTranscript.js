const mongoose = require('mongoose');

const ticketTranscriptSchema = new mongoose.Schema({
  ticketID: { type: String, required: true },      // The ID of the ticket
  transcript: { type: String, required: true },    // Encrypted transcript of the conversation
  createdAt: { type: Date, default: Date.now },    // Date when the transcript was saved
});

module.exports = mongoose.model('TicketTranscript', ticketTranscriptSchema);
