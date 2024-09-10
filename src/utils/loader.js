const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.slashCommands.set(command.name, command);
            console.log(`Loaded command: ${command.name}`);
        }
    }
}

function loadEvents(client) {
    const eventFiles = fs.readdirSync(path.join(__dirname, '../events/client')).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../events/client/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, (...args) => event.execute(...args, client));
        console.log(`Loaded event: ${eventName}`);
    }
}

module.exports = { loadCommands, loadEvents };
