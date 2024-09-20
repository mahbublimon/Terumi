document.addEventListener('DOMContentLoaded', () => {
  const avatarElement = document.getElementById('avatar');
  const usernameElement = document.getElementById('username');
  const userIdElement = document.getElementById('userId');
  const languageElement = document.getElementById('language');
  const guildsElement = document.getElementById('guilds');
  const resetButton = document.getElementById('reset');
  const wipeButton = document.getElementById('wipe');

  // Fetch profile data
  fetch('/api/profile')
    .then(response => response.json())
    .then(data => {
      avatarElement.src = data.avatar;
      usernameElement.textContent = `Username: ${data.username}`;
      userIdElement.textContent = `User ID: ${data.userId}`;
      languageElement.textContent = `Language: ${data.language}`;

      guildsElement.innerHTML = ''; // Clear default content
      data.guilds.forEach(guild => {
        const li = document.createElement('li');
        li.textContent = guild.name;
        if (guild.icon) {
          const img = document.createElement('img');
          img.src = guild.icon;
          img.alt = `${guild.name} icon`;
          img.width = 30;
          li.appendChild(img);
        }
        guildsElement.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });

  // Reset profile
  resetButton.addEventListener('click', () => {
    fetch('/api/profile/reset', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      });
  });

  // Wipe profile data
  wipeButton.addEventListener('click', () => {
    fetch('/api/profile/wipe', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        window.location.href = '/'; // Redirect to the homepage after wiping
      });
  });
});
