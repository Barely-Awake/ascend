import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getTargetUser from '../../../utils/discord/getTargetUser.js';
import error from '../../responses/error.js';
import config from '../../../utils/readConfig.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';

export default async function (message: Message, args: string[]) {
  let user = await getTargetUser(message, args[0]);

  if (typeof user === 'boolean')
    return error('Error finding target user', description.name, message);

  if (!user.hexAccentColor)
    user = await user.fetch(true);

  const creationDate = unixToSeconds(user.createdTimestamp);

  const embed = new MessageEmbed()
    .setTitle(`Information on \`${user.username}\``)
    .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: true, size: 4096}))
    .setColor(user.hexAccentColor || config.colors[1])
    .addField('Tag', user.tag)
    .addField('ID', user.id)
    .addField('Created', `${messageTimeStamp(creationDate)} (${messageTimeStamp(creationDate, 'R')})`);

  if (user.bot)
    embed.addField('Bot', 'true');

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'userinfo',
  description: 'Provides information on the given user.',
  usage: '[user]',
};