document.addEventListener('DOMContentLoaded', () => {
  const serversElement = document.getElementById('servers');
  const usersElement = document.getElementById('users');
  const cachedUsersElement = document.getElementById('cachedUsers');
  const channelsElement = document.getElementById('channels');
  const messagesPerMinuteElement = document.getElementById('messagesPerMinute');
  const uptimeElement = document.getElementById('uptime');

  function fetchStats() {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => {
        serversElement.textContent = data.servers;
        usersElement.textContent = data.users;
        cachedUsersElement.textContent = data.cachedUsers;
        channelsElement.textContent = data.channels;
        messagesPerMinuteElement.textContent = data.messagesPerMinute;
        uptimeElement.textContent = formatUptime(data.uptime);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
      });
  }

  // Format uptime in a readable format (e.g., HH:MM:SS)
  function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }

  // Update stats every 15 seconds
  fetchStats();
  setInterval(fetchStats, 15000);
});
