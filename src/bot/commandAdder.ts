import { readdir } from 'fs/promises';
import { CommandCollection } from '../types/discord.js';

export default async function commandAdder(
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
