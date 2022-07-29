import { EmbedBuilder, Message } from 'discord.js';
import { DenickEndPoint } from '../../../types/antiSniperResponseTypes.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerSkin } from '../../../utils/minecraft/mojangApi.js';
import makeWebRequest from '../../../utils/misc/makeWebRequest.js';
import config from '../../../utils/misc/readConfig.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('You must provide a nick!', message);

  const antiSniperData: DenickEndPoint = await makeWebRequest(
    `https://api.antisniper.net/denick?key=${config.antiSniperApiKey}&nick=${args[0]}`,
  );

  if (antiSniperData === null || !antiSniperData.success)
    return error('Failed to reach antisniper API.', message);

  if (!antiSniperData.player || antiSniperData.data === null)
    return error('Player is not denickable, did you mean to use find nick?', message);

  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(`Denick`)
        .setDescription(
          `Nick: ${antiSniperData.player.nick}\n` +
          `IGN: ${antiSniperData.player.ign}\n` +
          '*Embed is temporary, will be replaced with image soon*')
        .setImage(getPlayerSkin(antiSniperData.player.uuid)),
    ],
  });
}

export const description: DescriptionTypes = {
  name: 'denick',
  category: 'minecraft',
  description: 'Uses antisniper API to denick a player',
  usage: '<nick>',
};