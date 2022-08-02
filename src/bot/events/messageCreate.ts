import { Message } from 'discord.js';
import GuildData from '../../mongo/guildData.js';
import { error } from '../../utils/discord/responses.js';
import config from '../../utils/misc/readConfig.js';
import { Settings } from './_event.js';

export default function (message: Message) {
  commandHandler(message);
}

async function commandHandler(message: Message) {
  const prefixUsed = await fetchPrefix(message);

  if (!message.content.startsWith(prefixUsed))
    return;

  const messageContent = message.content.slice(prefixUsed.length);
  const messageArray = messageContent.split(' ');

  const commandName = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  const commandClass = message.client.commands.get(commandName);

  if (commandClass === undefined)
    return;

  try {
    commandClass.command(message, args);
    console.log(`${message.author.tag} ran command '${commandName}' in ${message.guild?.name || 'dms'}`);
  } catch (err) {
    await error(
      `An unknown error occurred with the command: \`${commandName}\`. Logs have been sent to the developers.` +
      `If this error continues, please join the support discord and let us know in #support.`,
      message,
    );
    console.error(`An unknown error occurred with the command: ${commandName}. Error:\n`, err);
  }
}

async function fetchPrefix(message: Message) {
  const botMention = (message.client.user || '').toString();
  let prefixUsed: string = config.prefix;

  if (message.guild) {
    if (message.client.cache.prefixes[message.guild.id] !== undefined) {
      prefixUsed = message.client.cache.prefixes[message.guild.id];
    } else {
      prefixUsed = await fetchMongoData(message);

      message.client.cache.prefixes[message.guild.id] = prefixUsed;
    }
  } else if (message.content.startsWith(`${botMention} `)) {
    prefixUsed = `${botMention} `;
  } else if (message.content.startsWith(botMention)) {
    prefixUsed = botMention;
  }
  return prefixUsed;
}

async function fetchMongoData(message: Message) {
  if (!message.guild)
    return config.prefix;

  const fetchedData = await GuildData.find({serverId: message.guild.id});

  if (fetchedData.length === 0)
    return config.prefix;

  return fetchedData[0].prefix;
}

export const settings: Settings = {
  once: false,
};
