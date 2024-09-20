const { Webhook } = require('@top-gg/sdk');
const express = require('express');

const topggWebhook = new Webhook(process.env.TOPGG_WEBHOOK_AUTH); // Top.gg webhook auth from .env

// Initialize Express Router for webhooks
const router = express.Router();

// Top.gg Webhook Endpoint
router.post('/topgg-webhook', topggWebhook.middleware(), async (req, res) => {
  const { user } = req.vote;

  // Log Channel for storing vote logs
  const logChannelId = process.env.VOTE_LOG_CHANNEL_ID;
  const logChannel = client.channels.cache.get(logChannelId);

  if (!logChannel) {
    console.error('Log channel not found.');
    return res.status(500).send('Log channel not found.');
  }

  // Send a message to the log channel with the voter info
  await logChannel.send(`User <@${user}> has voted for the bot! 🎉`);

  // Return success response
  res.status(200).send('Vote registered.');
});

module.exports = router;
