const mongoose = require('mongoose');

const supportMemberSchema = new mongoose.Schema({
  userID: { type: String, required: true },         // Discord user ID of the support team member
  guildID: { type: String, required: true },        // The ID of the guild (server)
  isAvailable: { type: Boolean, default: true },    // Whether the support member is available for ticket assignment
  ticketsAssigned: { type: Number, default: 0 },    // Number of tickets currently assigned
  roles: { type: [String], default: [] },           // The roles this member can handle (optional)
});

module.exports = mongoose.model('SupportMember', supportMemberSchema);
