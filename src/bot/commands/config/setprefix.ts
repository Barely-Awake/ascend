import { Message } from 'discord.js';
import GuildData from '../../../mongo/guildData.js';
import config from '../../../utils/misc/readConfig.js';
import { prefixCache } from '../../events/messageCreate.js';
import error from '../../responses/error.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  if (!message.guild || !message.member)
    return error('This command has to be run in a guild', description.name, message);

  if (!args || args[0] === undefined)
    return error('You have to provide a prefix', description.name, message);

  if (!message.member.permissions.has('MANAGE_GUILD'))
    return error('You must have permission to manage the server to do that', description.name, message);

  const prefix = args.join(' ');

  const fetchedData = await GuildData.find({serverId: message.guild.id});

  let guildInfo;
  if (fetchedData.length === 0)
    guildInfo = new GuildData({serverId: message.guild.id, prefix: prefix});
  else
    guildInfo = fetchedData[0];

  guildInfo.prefix = prefix;
  guildInfo.save();
  prefixCache[message.guild.id] = prefix;
  message.channel.send(`Successfully set prefix to ${prefix}`);
}

export const description: DescriptionTypes = {
  name: 'setprefix',
  category: 'config',
  description: 'Sets prefix in current guild',
  usage: '<prefix>',
};