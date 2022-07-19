import { Message } from 'discord.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import config from '../../../utils/misc/readConfig.js';
import error from '../../responses/error.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  if (!message.guild)
    return error('This command must be run in a guild', description.name, message);

  if (!message.member?.permissions.has('BanMembers'))
    return error('You can\'t unban users', description.name, message);

  if (!message.guild.members.me?.permissions.has('BanMembers'))
    return error(`${config.botName} doesn't have permission to unban members ` +
      `(*It's recommended to give ${config.botName} admin permissions*)`, description.name, message);

  const user = await resolveUser(message, args[0]);
  args.shift();
  const reason = args.join(' ');

  if (user === null)
    return error('Couldn\'t find that user', description.name, message);

  await message.guild.bans.remove(user, reason || 'None');

  return message.channel.send(
    `Successfully unbanned ${user.toString()} (\`${user.tag}\`) for ${reason || 'None'}`,
  );
}

export const description: DescriptionTypes = {
  name: 'unban',
  category: 'moderation',
  description: 'Unbans the target user',
  usage: '<user> [reason]',
};