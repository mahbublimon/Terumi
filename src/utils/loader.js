import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Utility to resolve paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async (client) => {
  const commandFolders = fs.readdirSync(path.join(__dirname, "../commands"));

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, `../commands/${folder}`))
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const { default: command } = await import(
        `../commands/${folder}/${file}`
      );
      client.commands.set(command.data.name, command);
    }
  }
};

export const loadEvents = async (client) => {
  const eventFolders = fs.readdirSync(path.join(__dirname, "../events"));

  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(path.join(__dirname, `../events/${folder}`))
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const { default: event } = await import(`../events/${folder}/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
};
