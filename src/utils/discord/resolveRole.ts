import { Message } from 'discord.js';

export default async function resolveRole(message: Message, argument: string) {
  const firstRoleMention = message.mentions.roles.first();
  if (firstRoleMention !== undefined)
    return firstRoleMention;

  if (argument)
    return message.guild?.roles.fetch(argument);

  return null;
}