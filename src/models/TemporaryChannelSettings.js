// src/models/TemporaryChannelSettings.js
const { Schema, model } = require('mongoose');

const temporaryChannelSettingsSchema = new Schema({
  guildID: { type: String, required: true },
  categoryID: { type: String, required: true },
  createChannelID: { type: String, required: true }, // The channel to join for creating temp channels
  channelNameTemplate: { type: String, default: "{user.name}'s Channel" },
  userLimit: { type: Number, default: 0 }, // 0 means no limit
});

module.exports = model('TemporaryChannelSettings', temporaryChannelSettingsSchema);
