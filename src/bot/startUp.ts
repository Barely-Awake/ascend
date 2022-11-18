import { CommandCollection } from './botData.js';
import {
  Client,
  IntentsBitField,
  GatewayIntentBits,
  ActivityType,
  Collection,
} from 'discord.js';
import { readdir } from 'fs/promises';
import config from '../utils/misc/readConfig.js';
import { makeHelpEmbeds } from './commands/help.js';

export function startDiscordBot() {
  const intents = new IntentsBitField().add([
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ]);

  const client = new Client({
    intents: intents,
    presence: {
      status: 'idle',
      activities: [
        {
          name: `@${config.botName} help`,
          type: ActivityType.Watching,
        },
      ],
    },
    failIfNotExists: false,
    allowedMentions: {
      repliedUser: false,
    },
  });
  client.commands = new Collection();
  client.cache = {
    prefixes: {},
  };

  commandAdder(client.commands).then(() => makeHelpEmbeds(client.commands));
  eventHandler(client);
  taskAdder(client);

  return client;
}

export async function commandAdder(
  commandCollection: CommandCollection,
  pathAdditions = ''
) {
  const commandFiles = await readdir(`./dist/bot/commands${pathAdditions}`);

  for (const file of commandFiles) {
    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js'))) {
      continue;
    }

    if (!file.endsWith('.js')) {
      await commandAdder(commandCollection, `${pathAdditions}/${file}`);
      continue;
    }

    const commandFile = await import(`./commands${pathAdditions}/${file}`);
    const CommandClass = commandFile.default;
    const commandInstance = new CommandClass();

    commandCollection.set(commandInstance.name, commandInstance);

    console.log(`Loaded command: ${commandInstance.name}`);

    if (commandInstance.aliases === null) {
      continue;
    }

    commandInstance.aliases.forEach((v: string) => {
      commandCollection.set(v, commandInstance);
    });
  }
}

export async function eventHandler(client: Client, pathAdditions = '') {
  const eventFiles = await readdir(`./dist/bot/events${pathAdditions}`);

  for (const file of eventFiles) {
    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js'))) {
      continue;
    }

    if (!file.endsWith('.js')) {
      await eventHandler(client, `${pathAdditions}/${file}`);
      continue;
    }

    const event = await import(`./events${pathAdditions}/${file}`);
    const eventName = file.split('.')[0];

    client[event.settings.once ? 'once' : 'on'](
      eventName,
      (...args: string[]) => event.default(...args)
    );
  }
}

export async function taskAdder(client: Client) {
  const taskFiles = await readdir('./dist/bot/tasks');
  for (const file of taskFiles) {
    if (file.startsWith('_') || !file.endsWith('.js')) {
      continue;
    }

    const task = await import(`./tasks/${file}`);
    const TaskClass = task.default;
    const taskInstance = new TaskClass();

    console.log(`Loaded task: ${taskInstance.name}`);

    setInterval(() => taskInstance.task(client), taskInstance.interval);
  }
}
