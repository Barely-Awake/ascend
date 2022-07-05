import { Message } from 'discord.js';
import config from '../../utils/misc/readConfig.js';
import error from '../responses/error.js';
import GuildData from '../../mongo/guildData.js';

export default function (message: Message): void {
  commandHandler(message);
}

async function commandHandler(message: Message) {
  const guildPrefix = await fetchGuildPrefix(message);

  if (!message.content.startsWith(guildPrefix))
    return;

  const messageContent = message.content.slice(guildPrefix.length);
  const messageArray = messageContent.split(' ');

  const commandName = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  const command = message.client.commands.get(commandName);

  if (typeof command !== 'function')
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

async function fetchGuildPrefix(message: Message) {
  const botMention = (message.client.user || '').toString();

  if (message.content.startsWith(`${botMention} `))
    return `${botMention} `;

  if (message.content.startsWith(botMention))
    return botMention;

  if (!message.guild)
    return config.prefix;

  const fetchedData = await GuildData.find({serverId: message.guild.id});

  if (fetchedData.length === 0)
    return config.prefix;

  return fetchedData[0].prefix;
}

export const settings = {
  once: false,
};