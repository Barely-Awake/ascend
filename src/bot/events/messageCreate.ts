import clientCollections from '../../index.js';
import { Message } from 'discord.js';
import config from '../../utils/readConfig.js';

export default async function (message: Message) {
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

  command(message, args);
}

export const settings = {
  once: false,
};