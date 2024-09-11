// src/models/ModerationRoles.js
const { Schema, model } = require('mongoose');

const moderationRolesSchema = new Schema({
  guildID: { type: String, required: true },
  roles: { type: [String], default: [] }, // Array of role IDs that are allowed to moderate
});

module.exports = model('ModerationRoles', moderationRolesSchema);
