const mongoose = require('mongoose');

const joinableRoleSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  roleID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('JoinableRole', joinableRoleSchema);
