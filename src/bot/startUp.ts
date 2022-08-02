import { Client } from 'discord.js';
import { readdir } from 'fs/promises';
import { CommandCollection } from '../types/discord.js';

export async function commandAdder(
  commandCollection: CommandCollection,
  pathAdditions = '',
) {
  const commandFiles = await readdir('./dist/bot/commands' + pathAdditions);

  for (const file of commandFiles) {
    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js')) {
      await commandAdder(commandCollection, pathAdditions + '/' + file);
      continue;
    }

    const commandFile = await import(`./commands${pathAdditions}/${file}`);
    const commandName = file.split('.')[0];

    const commandInstance = new commandFile.default();

    commandCollection.set(commandName, commandInstance);
    console.log(`Loaded command: ${commandName}`);
    if (commandFile.default.aliases === undefined)
      continue;
    commandFile.default.aliases.forEach((v: string) => {
      commandCollection.set(v, commandInstance);
    });
  }
}

export async function eventHandler(client: Client, pathAdditions = '') {
  const eventFiles = await readdir('./dist/bot/events' + pathAdditions);

  for (const file of eventFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js'))
      await eventHandler(client, pathAdditions + '/' + file);

    const event = await import(`./events${pathAdditions}/${file}`);

    const eventName = file.split('.')[0];
    if (event.settings.once)
      client.once(eventName, (...args: string[]) => event.default(...args));
    else
      client.on(eventName, (...args: string[]) => event.default(...args));
  }
}
