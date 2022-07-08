import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import { getPlayerNames, getPlayerUuid } from '../../../utils/minecraft/mojangApi.js';
import error from '../../responses/error.js';
import Player from '../../../mongo/player.js';
import { formatPlayerStats, getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';

export default async function (message: Message, args: string[]) {
  const existingDiscordData = await Player.find({discordId: message.author.id});

  if (existingDiscordData.length !== 0)
    return error('You have already linked on this discord account. Please use the unlink command and then try ' +
      'linking again.', description.name, message);

  if (!args[0])
    return error('Please provide the account you want to link with', description.name, message);

  args[0] = (args[0] || '').replace(/-/g, '');

  let mojangData;
  let playerUuid;

  if (args[0].length !== 32) {
    mojangData = await getPlayerUuid(args[0]);

    if (typeof mojangData === 'boolean')
      return error('Couldn\'t fetch that uuid', description.name, message);

    playerUuid = mojangData.id;
  } else {
    playerUuid = args[0];
    const nameHistory = await getPlayerNames(playerUuid);

    if (typeof nameHistory === 'boolean')
      return error('Couldn\'t fetch that players name', description.name, message);

    mojangData = {
      id: playerUuid,
      name: nameHistory[nameHistory.length - 1].name,
    };
  }
  const existingMinecraftData = await Player.find({playerUuid: playerUuid});

  if (existingMinecraftData.length !== 0)
    return error(`That minecraft account has already been linked with another discord account. ` +
      `Please use the unlink command on that account and then try linking again.`, description.name, message);

  const hypixelData = await getPlayerStats(playerUuid);

  if (typeof hypixelData === 'boolean')
    return error('Couldn\'t fetch that player\'s Hypixel stats', description.name, message);

  const hypixelStats = formatPlayerStats(hypixelData);

  if (hypixelStats.socialMedia.discord === null)
    return error('That account doesn\'t have a discord linked to it. If that is your account, you can click ' +
      'the link below to see how to do that.\nhttps://catboymaid.club/Z96boeByYUZd', description.name, message);

  if (hypixelStats.socialMedia.discord !== message.author.tag)
    return error(`Your discord (\`${message.author.tag}\`)doesn't match with the linked discord on that ` +
      `account (\`${hypixelStats.socialMedia.discord}\`)`, description.name, message);

  const playerData = new Player({
    playerUuid: playerUuid,
    discordId: message.author.id,
    playerName: mojangData.name,
  });
  await playerData.save();

  return message.channel.send(`Successfully linked \`${message.author.tag}\` to \`${mojangData.name}\``);
}

export const description: DescriptionTypes = {
  name: 'link',
  category: 'minecraft',
  description: 'Links your discord account to your minecraft account. Allows you to use stat checking commands ' +
    'without inputting your username',
  usage: '<player>',
};