// script.js

const updateDashboard = () => {
    fetch("/api/stats")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("servers-count").textContent =
                data.serverCount;
            document.getElementById("users-count").textContent = data.userCount;
            document.getElementById("channels-count").textContent =
                data.channelCount;
            document.getElementById("messages-rate").textContent =
                `${data.messageRate}/min`;
        })
        .catch((error) => console.error("Error fetching data:", error));
};

// Update stats every 15 seconds
setInterval(updateDashboard, 15000);

// Initial update when the page loads
updateDashboard();
