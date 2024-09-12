// src/models/Suggestion.js
const { Schema, model } = require('mongoose');

const suggestionSchema = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  suggestion: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Suggestion', suggestionSchema);
