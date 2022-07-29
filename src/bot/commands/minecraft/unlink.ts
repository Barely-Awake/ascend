import { Message } from 'discord.js';
import Player from '../../../mongo/player.js';
import { error } from '../../../utils/discord/responses.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, _: string[]) {
  const linkedAccountData = await Player.find({discordId: message.author.id});

  if (linkedAccountData.length === 0)
    return error('You haven\'t linked an account yet!', message);
  const names: string[] = [];

  linkedAccountData.forEach((v) => {
    if (v.playerName !== undefined)
      names.push(v.playerName);
  });
  await Player.deleteMany({discordId: message.author.id});

  return message.channel.send(`Successfully unlinked your discord account from \`${names.join(' & ') || 'Unknown'}\``);
}

export const commandInfo: CommandInfo = {
  name: 'unlink',
  category: 'minecraft',
  description: 'Unlinks your discord account from your minecraft account',
  usage: '',
};