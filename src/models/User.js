// src/models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userID: { type: String, required: true }, // Discord User ID
  guildID: { type: String, required: true }, // Guild ID for server-specific leveling
  experience: { type: Number, default: 0 }, // XP points
  level: { type: Number, default: 1 },      // Level of the user
  reputation: { type: Number, default: 0 }, // Reputation points
  lastMessage: { type: Date, default: Date.now } // To prevent XP farming
});

module.exports = model('User', userSchema);
