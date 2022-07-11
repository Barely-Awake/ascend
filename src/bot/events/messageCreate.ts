import { Message } from 'discord.js';
import GuildData from '../../mongo/guildData.js';
import config from '../../utils/misc/readConfig.js';
import error from '../responses/error.js';

export default function (message: Message): void {
  commandHandler(message);
}

const prefixCache: { [index: string]: string } = {};

async function commandHandler(message: Message) {
  const botMention = (message.client.user || '').toString();

  let guildPrefix = config.prefix;
  if (message.guild) {
    if (prefixCache[message.guild.id] !== undefined) {
      guildPrefix = prefixCache[message.guild.id];
    } else {
      guildPrefix = await fetchGuildPrefix(message);

      prefixCache[message.guild.id] = guildPrefix;
    }
  } else if (message.content.startsWith(`${botMention} `)) {
    guildPrefix = `${botMention} `;
  } else if (message.content.startsWith(botMention)) {
    guildPrefix = botMention;
  }

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
      `An unknown error occurred with the command: \`${commandName}\`. Logs have been sent to the developers.` +
      `If this error continues, please join the support discord and let us know in #support.`,
      commandName,
      message,
    );
    console.error(`An unknown error occurred with the command: ${commandName}. Error:\n`, err);
  }
}

async function fetchGuildPrefix(message: Message) {
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