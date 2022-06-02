import { Client } from 'discord.js';
import { readdir } from 'fs/promises';

export default async function eventHandler(client: Client, pathAdditions = '') {
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