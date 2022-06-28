import clientCollections from '../../index.js';
import { Message } from 'discord.js';
import config from '../../utils/misc/readConfig.js';
import error from '../responses/error.js';

export default function (message: Message): void {
  commandHandler(message);
}

function commandHandler(message: Message) {
  if (!message.content.startsWith(config.prefix))
    return;

  const messageArray = message.content.split(' ');

  let commandName = messageArray[0].toLowerCase();
  commandName = commandName.slice(config.prefix.length);
  const args = messageArray.slice(1);

  const command = clientCollections.commands.get(commandName);

  if (!command || typeof command !== 'function')
    return;

  try {
    command(message, args);
    console.log(`${message.author.tag} ran command '${commandName}' in ${message.guild?.name || 'dms'}`);
  } catch (err) {
    error(
      `An unknown error occurred with the command: \`${commandName}\`. Logs have been sent to the developers.`,
      commandName,
      message,
    );
    console.error(`An unknown error occurred with the command: ${commandName}. Error:\n`, err);
  }
}

export const settings = {
  once: false,
};