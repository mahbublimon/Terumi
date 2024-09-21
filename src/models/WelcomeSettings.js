const mongoose = require('mongoose');

const WelcomeSettingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Welcome!',
  },
  description: {
    type: String,
    default: 'Welcome to the server!',
  },
  thumbnail: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('WelcomeSettings', WelcomeSettingsSchema);
