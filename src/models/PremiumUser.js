// src/models/PremiumUser.js
const { Schema, model } = require('mongoose');

const premiumUserSchema = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  tier: { type: String, enum: ['standard', 'premium', 'custom'], required: true },
  subscriptionType: { type: String, enum: ['monthly', 'yearly'], required: true },
  subscribedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Expiry date based on subscription
});

module.exports = model('PremiumUser', premiumUserSchema);
