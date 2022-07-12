import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import config from '../../../utils/misc/readConfig.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';

export default async function (message: Message, args: string[]) {
  if (!message?.member?.permissions.has('KICK_MEMBERS'))
    return error('You can\'t kick users', description.name, message);

  if (!message.guild?.me?.permissions.has('KICK_MEMBERS'))
    return error(`${config.botName} doesn't have permission to kick members ` +
      `(*It's recommended to give ${config.botName} admin permissions*)`, description.name, message);

  const user = await resolveUser(message, args[0]);
  args.shift();
  const reason = args.join(' ');

  if (typeof user === 'boolean')
    return error('Couldn\'t find that user', description.name, message);

  if (user.id === message.author.id)
    return error('I\'m going to assume you don\'t want to kick yourself', description.name, message);

  const target = await message.guild?.members.resolve(user);

  if (target === null || target === undefined) {
    await message.guild.members.kick(user, reason || 'None');
  } else {

    if (target.roles.highest.position >= message.member?.roles.highest.position &&
      message.author.id !== message.guild.ownerId)
      return error('You can\'t kick that user', description.name, message);

    if (!target.kickable)
      return error(
        'I can\'t kick that user, make sure my role is higher than theirs', description.name, message,
      );

    await target.kick(reason || 'None');
  }

  return message.channel.send(
    `Successfully kicked ${user.toString()} (\`${user.tag}\`) for ${reason || 'None'}`,
  );
}

export const description: DescriptionTypes = {
  name: 'kick',
  category: 'moderation',
  description: 'Kick the target user',
  usage: '<user> [reason]',
};