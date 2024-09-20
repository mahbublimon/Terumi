const express = require('express'); 
const router = express.Router();
const { client } = require('../../../bot'); // Import bot client

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/discord');
  }
  next();
};

// Route to serve the profile page
router.get('/profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Route to fetch the user's profile data
router.get('/api/profile', isAuthenticated, (req, res) => {
  try {
    const user = req.session.user;
    const guilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id));

    res.json({
      username: user.username,
      userId: user.id,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      guilds: guilds.map(guild => ({
        name: guild.name,
        id: guild.id,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Failed to load profile data' });
  }
});

// Route to reset user profile data
router.post('/api/profile/reset', isAuthenticated, (req, res) => {
  req.session.user.language = 'en';  // Reset language or other preferences
  res.json({ message: 'Profile reset successfully' });
});

// Route to wipe user data
router.post('/api/profile/wipe', isAuthenticated, (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Failed to wipe data' });
      res.json({ message: 'Data wiped successfully' });
    });
  } catch (error) {
    console.error('Error wiping user data:', error);
    res.status(500).json({ message: 'Failed to wipe data' });
  }
});

module.exports = router;
