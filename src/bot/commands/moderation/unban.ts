import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import config from '../../../utils/misc/readConfig.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';

export default async function (message: Message, args: string[]) {
  if (!message.member?.permissions.has('BAN_MEMBERS'))
    return error('You can\'t unban users', description.name, message);

  if (!message.guild?.me?.permissions.has('BAN_MEMBERS'))
    return error(`${config.botName} doesn't have permission to unban members ` +
      `(*It's recommended to give ${config.botName} admin permissions*)`, description.name, message);

  const user = await resolveUser(message, args[0]);
  args.shift();
  const reason = args.join(' ');

  if (typeof user === 'boolean')
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