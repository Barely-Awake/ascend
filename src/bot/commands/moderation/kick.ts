import { GuildMember, Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getTargetUser from '../../../utils/discord/getTargetUser.js';
import error from '../../responses/error.js';
import config from '../../../utils/readConfig.js';

export default async function (message: Message, args: string[]) {
  const user = await getTargetUser(message, args[0]);

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

  if (!message?.member?.permissions.has('KICK_MEMBERS'))
    return error('You don\'t have the correct permissions', description.name, message);

  if (!message.guild?.me?.permissions.has('KICK_MEMBERS'))
    return error(`${config.botName} doesn't enough permission.
    *It's recommended to give ${config.botName} admin permissions*`, description.name, message);

  if (target.id === message.author.id)
    return error('I\'m going to assume you don\'t want to kick yourself', description.name, message);

  if (target.roles.highest.position >= message.member?.roles.highest.position &&
    message.author.id !== message.guild.ownerId)
    return error('Target user has a higher role than you', description.name, message);

  if (!target.kickable)
    return error('I can\'t kick that user', description.name, message);

  const reason = args.splice(0, 1).join(' ');

  await target.kick(reason || 'None');

  return message.channel.send(
    `Successfully kicked ${target.toString()} (\`${target.user.tag}\`) for ${reason || 'None'}`,
  );

}

export const description: DescriptionTypes = {
  name: 'kick',
  category: 'moderation',
  description: 'Kick the target user',
  usage: '<user> [reason]',
};