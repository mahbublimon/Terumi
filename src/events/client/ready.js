export default {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.afkMap = new Map(); // Initialize the AFK map to handle AFK users
  },
};
