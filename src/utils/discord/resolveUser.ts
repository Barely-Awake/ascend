import { Message } from 'discord.js';

export default async function resolveUser(message: Message, argument: string) {
  let user;

  try {
    if (!argument)
      user = message.author;
    else if (message.mentions.users.first())
      user = message.mentions.users.first();
    else
      // If there is no mentions then fetches user from id
      user = await message.client.users.fetch(argument);
  } catch {
    return false;
  }

  if (user === undefined)
    user = message.author;

  return user;
}