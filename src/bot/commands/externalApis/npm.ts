import { EmbedBuilder, Message } from 'discord.js';
import fetch from 'node-fetch';
import { botColors } from '../../../utils/discord/botData.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import { error } from '../../../utils/discord/responses.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, args: string[]) {
  const query = args.join(' ');
  if (!query)
    return;

  let res;
  try {
    res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`);
  } catch (err) {
    return error('Couldn\'t fetch npm registry', message);
  }

  if (res.status === 404)
    return error(`Couldn't find the npm package \`${query}\``, message);

  if (!res.ok)
    return error('Couldn\'t fetch npm registry', message);

  const body = await res.json();

  if (body.time.unpublished !== undefined)
    return error(`The npm package \`${query}\` was unpublished`, message);

  const timeCreated = unixToSeconds(Date.parse(body.time.created));
  const timeModified = unixToSeconds(Date.parse(body.time.modified));
  let repositoryUrl = body.repository?.url;

  if (typeof repositoryUrl !== 'string')
    repositoryUrl = 'Unknown';
  else if (repositoryUrl.includes('+') && !repositoryUrl.endsWith('+'))
    repositoryUrl = repositoryUrl?.split('+')[1];
  else if (repositoryUrl.startsWith('git://'))
    repositoryUrl = repositoryUrl.replace('git://', 'https://');

  repositoryUrl = repositoryUrl.replace('.git', '');

  const embed = new EmbedBuilder()
    .setColor(botColors[1])
    .setTitle(`Information on \`${body.name}\``)
    .setURL(`https://www.npmjs.com/package/${body.name}`)
    .setDescription(body.description !== undefined ? String(body.description) : '')
    .addFields([
      {
        name: 'Version',
        value: body['dist-tags']?.latest || 'Unknown',
      },
      {
        name: 'License',
        value: body.license || 'Unknown',
      },
      {
        name: 'Author',
        value: body.author ? body.author.name : 'Unknown',
      },
      {
        name: 'Created',
        value: `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`,
      },
      {
        name: 'Last Modified',
        value: body.time.modified ?
          `${messageTimeStamp(timeModified)} (${messageTimeStamp(timeModified, 'R')})` :
          `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`,
      },
      {
        name: 'Repository',
        value: repositoryUrl !== 'Unknown' ?
          `[Click!](${repositoryUrl})` :
          'Unknown',
      },
      {
        name: 'Maintainers',
        value: body.maintainers?.map((user: { name: string }) => user.name).join(', ') || 'Unknown',
      },
    ]);

  message.channel.send({embeds: [embed]});
}

export const commandInfo: CommandInfo = {
  name: 'npm',
  category: 'externalApis',
  description: 'Fetches information about an npm package',
  usage: '<package>',
};
