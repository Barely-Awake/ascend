import { Message } from 'discord.js';
import { canModerateUser, checkPermissions } from '../../../utils/discord/misc.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, args: string[]) {
  if (!message.guild || !message.member)
    return error(`This command must be run in a guild`, message);

  if (!checkPermissions(message.member, 'BanMembers'))
    return error('You can\'t ban users', message);

  if (!checkPermissions(await message.guild.members.fetchMe(), 'BanMembers'))
    return error('I don\'t have permission to ban members ' +
      '(*I\'m a moderation bot, it\'s recommended to give me admin*)', message);

  const user = await resolveUser(message, args[0]);
  args.shift();
  const reason = args.join(' ');

  if (user === null)
    return error('I couldn\'t find that user, make sure you\'re providing a mention or id', message);

  if (user.id === message.author.id)
    return error('I\'m going to assume you don\'t want to ban yourself', message);

  const target = await message.guild?.members.resolve(user);

  if (target === null || target === undefined) {
    await message.guild.members.ban(user, {reason: reason || 'None'});
  } else {

    if (!canModerateUser(message.member, target, message.guild.ownerId))
      return error('You can\'t ban that user, is your role higher than theirs?', message);

    if (!target.bannable)
      return error(
        'I can\'t ban that user, make sure my role is higher than theirs', message,
      );

    await target.ban({reason: reason || 'None'});
  }

  return message.channel.send(
    `Successfully banned ${user.toString()} (\`${user.tag}\`) for ${reason || 'None'}`,
  );
}

export const commandInfo: CommandInfo = {
  name: 'ban',
  category: 'moderation',
  description: 'Bans the target user',
  usage: '<user> [reason]',
};