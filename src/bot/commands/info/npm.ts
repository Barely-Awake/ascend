import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import config from '../../../utils/readConfig.js';
import error from '../../responses/error.js';
import fetch from 'node-fetch';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';

export default async function (message: Message, args: string[]) {
  let query = args.join(' ');
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

  const body: any = await res.json();

  if (body.time.unpublished !== undefined)
    return error(`The npm package \`${query}\` was unpublished`, description.name, message)

  let timeCreated = unixToSeconds(Date.parse(body.time.created));
  let timeModified = unixToSeconds(Date.parse(body.time.modified));

  const embed = new MessageEmbed()
    .setColor(config.colors[1])
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
    .addField('Repository', body.repository ?
        `[Click!](${body.repository?.url?.split('+')[1].replace('.git', '')})` :
        'Unknown'
      , false)
    .addField('Maintainers', body.maintainers?.map((user: any) => user.name).join(', ') || 'Unknown');

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'npm',
  description: 'Fetches information about an npm package',
  usage: '<package>',
};
