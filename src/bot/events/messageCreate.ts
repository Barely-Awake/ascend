import { Message } from 'discord.js';
import GuildData from '../../mongo/guildData.js';
import { error } from '../../utils/discord/responses.js';
import config from '../../utils/misc/readConfig.js';

export default function (message: Message): void {
  commandHandler(message);
}

const prefixCache: { [index: string]: string } = {};

async function commandHandler(message: Message) {
  const prefixUsed = await fetchPrefix(message);

  if (!message.content.startsWith(prefixUsed))
    return;

  const messageContent = message.content.slice(prefixUsed.length);
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
    if (prefixCache[message.guild.id] !== undefined) {
      prefixUsed = prefixCache[message.guild.id];
    } else {
      prefixUsed = await fetchMongoData(message);

      prefixCache[message.guild.id] = prefixUsed;
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

export const settings = {
  once: false,
};
export { prefixCache };