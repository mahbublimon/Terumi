document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/guilds')
        .then(response => response.json())
        .then(data => {
            const serverList = document.getElementById('server-list');
            data.guilds.forEach(guild => {
                const listItem = document.createElement('li');
                listItem.textContent = guild.name;
                serverList.appendChild(listItem);
            });
        });
});
