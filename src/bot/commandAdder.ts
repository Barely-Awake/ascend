import { Collection, Message } from 'discord.js';
import { readdir } from 'fs/promises';

export default async function commandAdder(
  commandCollection: Collection<string, (message: Message, args: string[]) => void | Promise<void>>,
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

    const command = await import(`./commands${pathAdditions}/${file}`);
    const commandName = file.split('.')[0];

    commandCollection.set(commandName, command.default);
    console.log(`Loaded command: ${commandName}`);
    if (command.commandInfo.aliases === undefined)
      continue;

    for (const key of Object.keys(command.commandInfo.aliases)) {
      commandCollection.set(command.commandInfo.aliases[key], command.default);
    }
  }
}
