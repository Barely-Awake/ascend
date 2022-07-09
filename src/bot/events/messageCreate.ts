import { Message, Collection } from 'discord.js';
import config from '../../utils/misc/readConfig.js';
import error from '../responses/error.js';
import GuildData from '../../mongo/guildData.js';
import { client } from "../../index.js";
export default function (message: Message): void {
  commandHandler(message);
}
let prefixCashe = new Collection<string, string>();
export {prefixCashe}
const botMention = (client.user || '').toString();

async function commandHandler(message: Message) {

  let guildPrefix = config.prefix;
  if (message.guild){
  
  if (prefixCashe.has(message.guild.id)) {

    let casheCheck = prefixCashe.get(message.guild.id);

    if (casheCheck) guildPrefix = casheCheck;
  }

 
  else {

    guildPrefix = await fetchGuildPrefix(message);

    prefixCashe.set(message?.guild?.id, guildPrefix);
  }
}
  if (message.content.startsWith(`${botMention} `)) {
    guildPrefix = botMention

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
      `An unknown error occurred with the command: \`${commandName}\`. Logs have been sent to the developers.`,
      commandName,
      message,
    );
    console.error(`An unknown error occurred with the command: ${commandName}. Error:\n`, err);
  }
}

async function fetchGuildPrefix(message: Message) {
  const botMention = (message.client.user || '').toString();
  if (!message.guild) return config.prefix;
  const fetchedData = await GuildData.find({serverId: message.guild.id});

  if (fetchedData.length === 0)
    return config.prefix;

  return fetchedData[0].prefix;
}

export const settings = {
  once: false,
};