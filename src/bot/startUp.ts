import { CommandCollection } from './botData.js';
import { Client } from 'discord.js';
import { readdir } from 'fs/promises';

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
