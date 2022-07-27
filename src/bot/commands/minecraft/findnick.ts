import { Message } from 'discord.js';
import { FindNickEndPoint } from '../../../types/antiSniperResponseTypes.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';
import makeWebRequest from '../../../utils/misc/makeWebRequest.js';
import config from '../../../utils/misc/readConfig.js';
import { DescriptionTypes } from '../_example.js';
import { drawBedWarsCanvas } from './bedwars.js';

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();
  if (!args[0])
    return error('You must provide a player!', message);

  const antiSniperData: FindNickEndPoint = await makeWebRequest(
    `https://api.antisniper.net/findnick?key=${config.antiSniperApiKey}&name=${args[0]}`,
  );

  if (antiSniperData === null || !antiSniperData.success)
    return error('Failed to reach antisniper API.', message);

  if (!antiSniperData.player || antiSniperData.data === null)
    return error('I couldn\'t find that player\'s nick', message);

  const playerStats = await getPlayerStats(antiSniperData.player.uuid);
  if (playerStats === null)
    return message.reply('Couldn\'t get player stats from Hypixel\'s API');

  playerStats.nick = antiSniperData.player.nick;

  const canvas = await drawBedWarsCanvas(playerStats);

  await message.reply({
    files: [
      {attachment: canvas, name: `${playerStats.displayName}.png`},
    ],
  });
}

export const description: DescriptionTypes = {
  name: 'findnick',
  category: 'minecraft',
  description: 'Uses antisniper API to find a player\'s nick',
  usage: '<player>',
};