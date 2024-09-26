const mongoose = require('mongoose');

const tempChannelSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  channelID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('TempChannel', tempChannelSchema);
