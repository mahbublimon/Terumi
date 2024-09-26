const { Schema, model } = require('mongoose');

const tempChannelSchema = new Schema({
  guildID: { type: String, required: true },
  channelID: { type: String, required: true }, // The channel that triggers temp voice creation
});

module.exports = model('TempChannel', tempChannelSchema);
