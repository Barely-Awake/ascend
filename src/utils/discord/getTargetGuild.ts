import { Message } from 'discord.js';

export default async function getTargetGuild(message: Message, argument: string) {
  let target;

  try {
    if (!argument && message.inGuild())
      target = await message.client.guilds.fetch({guild: message.guildId, withCounts: true});
    else if (argument)
      target = await message.client.guilds.fetch({guild: argument, withCounts: true});
    else
      // If there is no mentions and the message isn't in a guild return
      return false;
  } catch {
    return false;
  }

  if (target === undefined)
    return false;

  return target;
}