import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import Player from '../../../mongo/player.js';
import error from '../../responses/error.js';

export default async function (message: Message, args: string[]) {
  const linkedAccountData = await Player.find({discordId: message.author.id});

  if (linkedAccountData.length === 0)
    return error('You haven\'t linked an account yet!', description.name, message);
  let names: string[] = [];

  linkedAccountData.forEach((v) => {
    if (v.playerName !== undefined)
      names.push(v.playerName);
  });
  await Player.deleteMany({discordId: message.author.id});

  return message.channel.send(`Successfully unlinked your discord account from \`${names.join(' & ') || 'Unknown'}\``);
}

export const description: DescriptionTypes = {
  name: 'unlink',
  description: 'Unlinks your discord account from your minecraft account',
  usage: '',
};