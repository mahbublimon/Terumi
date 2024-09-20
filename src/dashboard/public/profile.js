document.addEventListener('DOMContentLoaded', () => {
  const avatarElement = document.getElementById('avatar');
  const usernameElement = document.getElementById('username');
  const userIdElement = document.getElementById('userId');
  const roleElement = document.getElementById('role');
  const languageElement = document.getElementById('language');
  const guildsElement = document.getElementById('guilds');
  const resetProfileButton = document.getElementById('resetProfile');
  const wipeDataButton = document.getElementById('wipeData');

  // Fetch user profile from the server
  function fetchProfile() {
    fetch('/api/profile')
      .then(response => response.json())
      .then(data => {
        avatarElement.src = data.avatar;
        usernameElement.textContent = data.username;
        userIdElement.textContent = data.userId;
        roleElement.textContent = 'User'; // You can dynamically assign roles later if needed
        languageElement.textContent = data.language || 'en';

        // Populate guilds
        guildsElement.innerHTML = ''; // Clear previous content
        data.guilds.forEach(guild => {
          const guildRow = document.createElement('div');
          guildRow.classList.add('guild');

          const guildIcon = document.createElement('img');
          guildIcon.src = guild.icon || '/default-icon.png'; // Fallback for guild without an icon

          const guildName = document.createElement('div');
          guildName.classList.add('guild-name');
          guildName.textContent = guild.name;

          guildRow.appendChild(guildIcon);
          guildRow.appendChild(guildName);
          guildsElement.appendChild(guildRow);
        });
      })
      .catch(err => console.error('Error fetching profile:', err));
  }

  // Handle profile reset
  resetProfileButton.addEventListener('click', () => {
    fetch('/api/profile/reset', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(err => console.error('Error resetting profile:', err));
  });

  // Handle data wipe
  wipeDataButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to wipe your data? This cannot be undone.')) {
      fetch('/api/profile/wipe', {
        method: 'POST',
      })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(err => console.error('Error wiping data:', err));
    }
  });

  // Fetch profile on load
  fetchProfile();
});
