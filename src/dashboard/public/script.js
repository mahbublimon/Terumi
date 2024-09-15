document.addEventListener('DOMContentLoaded', () => {
  const serversElement = document.getElementById('servers');
  const usersElement = document.getElementById('users');
  const cachedUsersElement = document.getElementById('cachedUsers');
  const channelsElement = document.getElementById('channels');
  const uptimeElement = document.getElementById('uptime');
  const profileElement = document.getElementById('profile');

  function fetchStats() {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => {
        serversElement.textContent = data.servers;
        usersElement.textContent = data.users;
        cachedUsersElement.textContent = data.cachedUsers;
        channelsElement.textContent = data.channels;
        uptimeElement.textContent = formatUptime(data.uptime);
      })
      .catch(err => console.error('Error fetching stats:', err));
  }

  function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }

  fetchStats();
  setInterval(fetchStats, 15000);
});
