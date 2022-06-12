import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getPlayerUuid from '../../../utils/minecraft/getPlayerUuid.js';
import error from '../../responses/error.js';
import Player from '../../../mongo/player.js';
import getPlayerStats from '../../../utils/minecraft/getPlayerStats.js';
import formatPlayerStats from '../../../utils/minecraft/formatPlayerStats.js';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('Please provide the account you want to link with', description.name, message);

  args[0] = (args[0] || '').replace(/-/g, '');

  let playerUuid;

  if (args[0].length !== 32)
    playerUuid = await getPlayerUuid(args[0]);
  else
    playerUuid = {id: args[0]};

  if (typeof playerUuid === 'boolean')
    return error('Couldn\'t fetch that uuid', description.name, message);

  playerUuid = playerUuid.id;

  const hypixelData = await getPlayerStats(playerUuid);

  if (typeof hypixelData === 'boolean')
    return error('Couldn\'t fetch that player\'s Hypixel stats', description.name, message);

  const hypixelStats = formatPlayerStats(hypixelData);

  if (hypixelStats.socialMedia.discord === null)
    return error('That account doesn\'t have a discord linked to it. If that is your account, you can click ' +
      'the link below to see how to do that.\nhttps://catboymaid.club/Z96boeByYUZd', description.name, message);

  if (hypixelStats.socialMedia.discord !== message.author.tag)
    return error('Your discord doesn\'t match with the linked discord on that account ' +
      `(\`${hypixelStats.socialMedia.discord}\`)`, description.name, message);

  const playerData = new Player({playerUuid: playerUuid, discordId: message.author.id});
  await playerData.save();
}

export const description: DescriptionTypes = {
  name: 'link',
  description: 'Links your discord account to your minecraft account. Allows you to use stat checking commands ' +
    'without inputting your username',
  usage: '<player>',
};