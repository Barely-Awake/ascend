import { Message } from 'discord.js';
import { DenickEndPoint } from '../../../types/antiSniperResponseTypes.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';
import makeWebRequest from '../../../utils/misc/makeWebRequest.js';
import config from '../../../utils/misc/readConfig.js';
import { CommandInfo } from '../_command.js';
import { drawBedWarsCanvas } from './bedwars.js';

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();
  if (!args[0])
    return error('You must provide a nick!', message);

  const antiSniperData: DenickEndPoint = await makeWebRequest(
    `https://api.antisniper.net/denick?key=${config.antiSniperApiKey}&nick=${args[0]}`,
  );

  if (antiSniperData === null || !antiSniperData.success)
    return error('Failed to reach antisniper API.', message);

  if (!antiSniperData.player || antiSniperData.data === null)
    return error('Player is not denickable, did you mean to use find nick?', message);

  const playerStats = await getPlayerStats(antiSniperData.player.uuid);
  if (playerStats === null)
    return message.reply('Couldn\'t get player stats from Hypixel\'s API');

  playerStats.nick = antiSniperData.player.nick;

  const canvas = await drawBedWarsCanvas(playerStats);

  await message.reply({
    files: [
      {attachment: canvas, name: `${playerStats.displayName}-top (i'm a top :weary:).png`},
    ],
  });
}

export const commandInfo: CommandInfo = {
  name: 'denick',
  category: 'minecraft',
  description: 'Uses antisniper API to denick a player',
  usage: '<nick>',
};