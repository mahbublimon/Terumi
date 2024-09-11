// src/models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  experience: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

module.exports = model('User', userSchema);
