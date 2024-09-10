import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all commands from the `commands` folder
export async function loadCommands(client) {
    const commandFolders = readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = await import(`../commands/${folder}/${file}`);
            client.commands.set(command.data.name, command);
            console.log(`Loaded command: ${command.data.name}`);
        }
    }
}

// Load all events from the `events` folder
export async function loadEvents(client) {
    const eventFiles = readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = await import(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`Loaded event: ${event.name}`);
    }
}
