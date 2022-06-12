import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';

export default function (message: Message, args: string[]) {
  message.delete();

  if (message.member !== null && !message.member?.permissions.has('MANAGE_GUILD'))
    return error('You need to have the manage server permission to use this command', description.name, message);

  if (!args[0] || !args[1])
    return error('Please provided the needed arguments', description.name, message);

  if (args[0].startsWith('#'))
    args[0] = args[0].slice();

  let providedEmbedColor = args[0];

  // Make sure the length of the provided color is 6 chars
  if (providedEmbedColor.length > 6)
    providedEmbedColor = providedEmbedColor.slice(-(providedEmbedColor.length - 6));
  else if (providedEmbedColor.length < 6)
    providedEmbedColor = providedEmbedColor + '0'.repeat(6 - providedEmbedColor.length);

  let embedColor = parseInt(providedEmbedColor, 16);

  // Removes the color argument from the array
  args = args.splice(1);

  const text = args.join(' ');
  const embedArray = text.includes('|') ? text.split('|') : [text];

  let embed = new MessageEmbed()
    .setColor(embedColor);
  if (embedArray[0] !== '' && embedArray[0] !== ' ')
    embed = embed.setTitle(embedArray[0]);

  if (embedArray[1] && embedArray[1] !== '' && embedArray[1] !== ' ')
    embed = embed.setDescription(embedArray[1]);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'embed',
  description: 'Sends a simple embed to the current channel. \`text\` should be formatted with | separating the ' +
    'title and description. For example: \`this is a title | this is a description\` (Manage Server permission needed)',
  usage: '<color> <text>',
};