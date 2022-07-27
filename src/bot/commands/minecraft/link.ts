import { Message } from 'discord.js';
import Player from '../../../mongo/player.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';
import { getPlayerNames, getPlayerUuid } from '../../../utils/minecraft/mojangApi.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  const existingDiscordData = await Player.find({discordId: message.author.id});

  if (existingDiscordData.length !== 0)
    return error('You have already linked on this discord account. Please use the unlink command and then try ' +
      'linking again.', message);

  if (!args[0])
    return error('Please provide the account you want to link with', message);

  args[0] = (args[0] || '').replace(/-/g, '');

  let mojangData;
  let playerUuid;

  if (args[0].length !== 32) {
    mojangData = await getPlayerUuid(args[0]);

    if (mojangData === null)
      return error('Couldn\'t fetch that uuid', message);

    playerUuid = mojangData.id;
  } else {
    playerUuid = args[0];
    const nameHistory = await getPlayerNames(playerUuid);

    if (nameHistory === null)
      return error('Couldn\'t fetch that players name', message);

    mojangData = {
      id: playerUuid,
      name: nameHistory[nameHistory.length - 1].name,
    };
  }
  const existingMinecraftData = await Player.find({playerUuid: playerUuid});

  if (existingMinecraftData.length !== 0)
    return error(`That minecraft account has already been linked with another discord account. ` +
      `Please use the unlink command on that account and then try linking again.`, message);

  const playerStats = await getPlayerStats(playerUuid);

  if (playerStats === null)
    return message.reply('Couldn\'t get player stats from Hypixel\'s API');

  if (playerStats.socialMedia.discord === null)
    return error('That account doesn\'t have a discord linked to it. If that is your account, you can click ' +
      'the link below to see how to do that.\nhttps://catboymaid.club/Z96boeByYUZd', message);

  if (playerStats.socialMedia.discord !== message.author.tag)
    return error(`Your discord (\`${message.author.tag}\`)doesn't match with the linked discord on that ` +
      `account (\`${playerStats.socialMedia.discord}\`)`, message);

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