# Terumi

Terumi is a fully-featured, customizable Discord bot built using **Discord.js v14**. It includes features such as a ticketing system, music commands, giveaways, leveling, moderation tools, and more. It uses MongoDB for data storage and supports slash commands for an intuitive user experience.

## Features

- **Ticket System**: Create, manage, and close tickets with buttons and embeds.
- **Music Commands**: Play music, manage queues, pause, resume, and more with slash commands and buttons.
- **Giveaway System**: Easily create and manage giveaways using buttons.
- **Fun Commands**: Commands for entertainment like `/hug`, `/afk`, `/meme`.
- **Game Commands**: Fun commands related to games and characters.
- **Moderation System**: Kick, ban, mute, warn, and more to maintain server integrity.
- **Temporary Voice Channels**: Allow users to create temporary voice channels with customizable permissions.
- **Leveling System**: Role assignment based on user levels, with customizable experience gains.
- **Reaction Roles**: Assign roles to users when they react to specific messages.
- **Logs**: Comprehensive logging system for messages, moderation actions, and voice activities.
- **Utility Commands**: Helpful commands like `/ping` to check bot latency and `/avatar` to get a user's profile picture.
- **Slash Commands**: Modern and user-friendly slash commands for all bot functionalities.
- **Dashboard**: Manage the bot settings and logs via an optional web dashboard.
- **Automod**: Automated moderation features.
- **Customizable**: Highly configurable through the code and environment variables.

## Features in Detail

### Ticket System

The ticket system allows users to create support tickets. The tickets are created using buttons, and the server staff can manage them from a private ticket channel.

- **Command**: `/create-ticket`
- **Interaction**: Creates a new private ticket channel for the user and staff.

### Music System

The music commands allow users to play, pause, skip, and manage queues directly in voice channels.

- **Command**: `/play [song name]`
- **Commands**: `/pause`, `/resume`, `/skip`, `/queue`, and more.

### Giveaways

Easily manage giveaways with timed durations, entry buttons, and automatic winner selection.

- **Command**: `/giveaway-create`
- **Interaction**: Users can enter by clicking a button.

### Leveling System

A fully integrated leveling system that rewards users with experience for being active in the server. Levels can be used to assign roles automatically.

- **Command**: `/profile` shows a user's level.
- **Command**: `/leaderboard` shows the top users by experience.

### Moderation

A suite of moderation tools to maintain server integrity.

- **Commands**: `/kick`, `/ban`, `/mute`, `/warn`, `/prune`, `/lock`, and more.

### Dashboard

An optional web dashboard for managing the bot’s settings, viewing logs, and configuring features.

## Commands

Below are some of the available commands:

### Fun Commands

- `/hug [user]`: Hug a user.
- `/afk [message]`: Set your AFK message.
- `/meme`: Fetch a random meme from the Meme API.

### Music Commands

- `/play [song]`: Play a song.
- `/pause`: Pause the current song.
- `/resume`: Resume the song.

### Utility Commands

- `/ping`: Check bot latency.
- `/avatar [user]`: Get a user's avatar.
- `/server-info`: Get information about the server.

### Moderation Commands

- `/kick [user] [reason]`: Kick a user.
- `/ban [user] [reason]`: Ban a user.
- `/mute [user] [duration]`: Mute a user for a specific time.

### Leveling Commands

- `/profile [user]`: Display a user's leveling profile.
- `/leaderboard`: Display the leveling leaderboard.

## Contributing

Feel free to fork the repository and make changes! If you'd like to contribute directly to this repository, please open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
