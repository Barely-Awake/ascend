# Ascend

Ascend is a bot made by [Barely Awake](https://github.com/Barely-Awake)
that aims to be an **open source** alternative to many discord bots.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Features

Ascend is mainly a side project worked on occasionally, so it's not very
feature rich.
That being said, the main reason for creating this bot was to figure out how to
make a great discord bot that's easily extendable, so if you want a command or
feature that's not currently in the bot, you can either ask for me to add in
the [support server](https://discord.gg/PpdbKXKgT3) or create it yourself
and make a pull request.
This also goes for bugs or things that you don't think are working as intended.
While it may not look like it, I'm actively working on this bot, so I should
see pretty quickly if you try to reach out.

Anyway, here are some of the things the bot can do right now:

- Linking Minecraft and discord accounts
- Hypixel Bed Wars Stats
- View Minecraft Skin
- Moderation Actions (kick, ban, mute, etc.)
- View a GitHub Profile
- View an NPM Packages

## Self Hosting

Honestly, I'd prefer it if you just invited the instance of the bot I'm using,
however I understand wanting to host something yourself, so I'll still provide a guide.

### Requirements

The following are required to set up the bot:

1. Discord Bot
2. MongoDB Instance
3. Hypixel API Key
4. Anti-Sniper API Key

If you don't know how to set up a Discord bot or MongoDB, there are
plenty of guides online, so you'll have to look that up.

A Hypixel API key can be obtained by joining the Minecraft server `mc.hypixel.net`
and using the command `/api`.

An Anti-Sniper API key can be obtained by joining the
[Anti-Sniper Discord](https://discord.gg/antisniper) and reading `#✨info`.

### Set Up

1. Create a file called `.env` then copy and fill out the fields from the
   `.env.example` file.
2. Install modules with `npm install`
3. Compile with the `tsc` command (You can also use `npm run build` if you don't want to globally install typescript)
4. Start the bot with `npm start`

## Links

### [Invite URL](https://discord.com/api/oauth2/authorize?client_id=827414617684049931&permissions=412317248584&scope=applications.commands%20bot)

### [Support Server](https://discord.gg/PpdbKXKgT3)

### [Author](https://github.com/Barely-Awake)
