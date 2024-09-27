document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display the user's servers
  fetch('/api/profile')
    .then(response => response.json())
    .then(data => {
      const serverList = document.getElementById('server-list');
      data.guilds.forEach(guild => {
        const serverDiv = document.createElement('div');
        serverDiv.className = 'server';
        serverDiv.innerHTML = `
          <img src="${guild.icon}" alt="${guild.name}">
          <h3>${guild.name}</h3>
        `;
        serverList.appendChild(serverDiv);
      });
    })
    .catch(err => console.error('Error loading profile:', err));
});
