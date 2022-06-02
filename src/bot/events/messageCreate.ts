import clientCollections from '../../index.js';
import { Message } from 'discord.js';
import config from '../../utils/readConfig.js';
import error from '../responses/error.js';

export default function (message: Message) {
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
  } catch (err) {
    error('Unknown Error. Logs have been send to developers.', commandName, message);
    console.error(`Error with command ${commandName}:\n${err}`);
  }
}

export const settings = {
  once: false,
};