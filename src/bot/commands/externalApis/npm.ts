import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import fetch from 'node-fetch';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import botColors from '../../../utils/discord/botColors.js';

export default async function (message: Message, args: string[]) {
  const query = args.join(' ');
  if (!query)
    return;

  let res;
  try {
    res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`);
  } catch (err) {
    return error('Couldn\'t fetch npm registry', description.name, message);
  }

  if (res.status === 404)
    return error(`Couldn't find the npm package \`${query}\``, description.name, message);

  if (!res.ok)
    return error('Couldn\'t fetch npm registry', description.name, message);

  const body = await res.json();

  if (body.time.unpublished !== undefined)
    return error(`The npm package \`${query}\` was unpublished`, description.name, message);

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

  const embed = new MessageEmbed()
    .setColor(botColors[1])
    .setTitle(`Information on \`${body.name}\``)
    .setURL(`https://www.npmjs.com/package/${body.name}`)
    .setDescription(body.description !== undefined ? String(body.description) : '')
    .addField('Version', body['dist-tags']?.latest || 'Unknown', false)
    .addField('License', body.license || 'Unknown', false)
    .addField('Author', body.author ? body.author.name : 'Unknown', false)
    .addField('Created',
      `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`
      , false)
    .addField('Last Modified', body.time.modified ?
        `${messageTimeStamp(timeModified)} (${messageTimeStamp(timeModified, 'R')})` :
        `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`
      , false)
    .addField('Repository', repositoryUrl !== 'Unknown' ?
        `[Click!](${repositoryUrl})` :
        'Unknown',
      false)
    .addField('Maintainers', body.maintainers?.map((user: { name: string }) => user.name).join(', ') || 'Unknown');

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'npm',
  category: 'externalApis',
  description: 'Fetches information about an npm package',
  usage: '<package>',
};
