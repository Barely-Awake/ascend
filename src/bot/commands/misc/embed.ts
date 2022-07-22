import { EmbedBuilder, Message } from 'discord.js';
import { error } from '../../../utils/discord/responses.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  await message.delete();

  if (message.member !== null && !message.member?.permissions.has('ManageGuild'))
    return error('You need to have the manage server permission to use this command', message);

  if (!args[0] || !args[1])
    return error('Please provided the needed arguments', message);

  if (args[0].startsWith('#'))
    args[0] = args[0].slice();

  let providedEmbedColor = args[0];

  // Make sure the length of the provided color is 6 chars
  if (providedEmbedColor.length > 6)
    providedEmbedColor = providedEmbedColor.slice(-(providedEmbedColor.length - 6));
  else if (providedEmbedColor.length < 6)
    providedEmbedColor = providedEmbedColor + '0'.repeat(6 - providedEmbedColor.length);

  const embedColor = parseInt(providedEmbedColor, 16);

  // Removes the color argument from the array
  args = args.splice(1);

  const text = args.join(' ');
  const embedArray = text.includes('|') ? text.split('|') : [text];

  let embed = new EmbedBuilder()
    .setColor(embedColor);
  if (embedArray[0] !== '' && embedArray[0] !== ' ')
    embed = embed.setTitle(embedArray[0]);

  if (embedArray[1] && embedArray[1] !== '' && embedArray[1] !== ' ')
    embed = embed.setDescription(embedArray[1]);

  const responseMessage = await message.channel.send({embeds: [embed]});
  if (responseMessage.crosspostable)
    responseMessage.crosspost();
}

export const description: DescriptionTypes = {
  name: 'embed',
  category: 'misc',
  description: 'Sends a simple embed to the current channel. \`text\` should be formatted with | separating the ' +
    'title and description. For example: \`this is a title | this is a description\` (Manage Server permission needed)',
  usage: '<color> <text>',
};