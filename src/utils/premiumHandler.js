// src/utils/premiumHandler.js
const PremiumUser = require('../models/PremiumUser');

module.exports = {
  // Subscribe a user to a premium tier
  async subscribeUser(userID, guildID, tier, subscriptionType) {
    const subscriptionLength = subscriptionType === 'monthly' ? 30 : 365; // Days

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + subscriptionLength);

    let premiumUser = await PremiumUser.findOne({ userID, guildID });

    if (premiumUser) {
      premiumUser.tier = tier;
      premiumUser.subscriptionType = subscriptionType;
      premiumUser.expiresAt = expiresAt;
    } else {
      premiumUser = new PremiumUser({ userID, guildID, tier, subscriptionType, expiresAt });
    }

    await premiumUser.save();
    return premiumUser;
  },

  // Check if a user has an active premium subscription
  async isUserPremium(userID, guildID) {
    const premiumUser = await PremiumUser.findOne({ userID, guildID });
    if (!premiumUser || new Date() > premiumUser.expiresAt) {
      return false;
    }
    return premiumUser;
  },

  // Fetch a user's premium tier
  async getUserTier(userID, guildID) {
    const premiumUser = await PremiumUser.findOne({ userID, guildID });
    return premiumUser ? premiumUser.tier : 'standard';
  },
};
