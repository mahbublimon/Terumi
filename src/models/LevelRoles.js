// src/models/LevelRoles.js
const { Schema, model } = require('mongoose');

const levelRolesSchema = new Schema({
  guildID: { type: String, required: true },
  levelRoles: [
    {
      level: { type: Number, required: true },
      roleID: { type: String, required: true },
    },
  ],
  stackRoles: { type: Boolean, default: false }, // Determines whether roles stack or not
});

module.exports = model('LevelRoles', levelRolesSchema);
