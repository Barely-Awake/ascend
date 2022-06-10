import { GuildMember, Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getTargetUser from '../../../utils/discord/getTargetUser.js';
import error from '../../responses/error.js';
import config from '../../../utils/readConfig.js';

export default async function (message: Message, args: string[]) {
  let user = await getTargetUser(message, args[0]);

  if (typeof user === 'boolean')
    return error('Unknown User', description.name, message);
  let target;
  try {
    target = message.guild?.members.resolve(user);
  } catch {
    target = null;
  }

  if (!(target instanceof GuildMember))
    return error('Couldn\'t find that user in the guild. Are they in this guild?', description.name, message);

  if (!message?.member?.permissions.has('BAN_MEMBERS'))
    return error('You don\'t have the correct permissions', description.name, message);

  if (!message.guild?.me?.permissions.has('BAN_MEMBERS'))
    return error(`${config.botName} doesn't enough permission.
    *It's recommended to give ${config.botName} admin permissions*`, description.name, message);

  if (target.id === message.author.id)
    return error('I\'m going to assume you don\'t want to ban yourself', description.name, message);

  if (target.roles.highest.position >= message.member?.roles.highest.position &&
    message.author.id !== message.guild.ownerId)
    return error('Target user has a higher role than you', description.name, message);

  if (!target.bannable)
    return error('I can\'t ban that user', description.name, message);

  const reason = args.splice(0, 1).join(' ');

  await target.ban({
    reason: reason || 'None',
  });

  return message.channel.send(
    `Successfully banned ${target.toString()} (\`${target.user.tag}\`) for ${reason || 'None'}`
  );

}

export const description: DescriptionTypes = {
  name: 'ban',
  description: 'Bans the target user',
  usage: '<user> [reason]',
};