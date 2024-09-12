const mongoose = require('mongoose');

const ModerationRolesSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  roles: {
    type: [String], // Array of role IDs that are allowed to moderate
    required: true,
  },
});

module.exports = mongoose.model('ModerationRoles', ModerationRolesSchema);
