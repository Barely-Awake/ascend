import { EmbedBuilder, Message } from 'discord.js';
import { botColors } from '../../../utils/discord/botData.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  let user = await resolveUser(message, args[0]);

  if (user === null)
    return error('Error finding target user', message);

  await user.fetch();

  if (!user.hexAccentColor)
    user = await user.fetch(true);

  const creationDate = unixToSeconds(user.createdTimestamp);

  const embed = new EmbedBuilder()
    .setTitle(`Information on \`${user.username}\``)
    .setThumbnail(user.displayAvatarURL({size: 4096}))
    .setColor(user.hexAccentColor || botColors[1])
    .addFields([
      {
        name: 'Tag',
        value: user.tag,
      },
      {
        name: 'ID',
        value: user.id,
      },
      {
        name: 'Created',
        value: `${messageTimeStamp(creationDate, 'R')} (${messageTimeStamp(creationDate)})`,
      },
    ]);

  if (user.bot)
    embed.addFields([{
      name: 'Bot',
      value: 'true',
    }]);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'userinfo',
  category: 'misc',
  description: 'Provides information on the given user.',
  usage: '[user]',
};