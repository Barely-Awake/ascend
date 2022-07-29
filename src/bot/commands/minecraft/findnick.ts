import { EmbedBuilder, Message } from 'discord.js';
import { FindNickEndPoint } from '../../../types/antiSniperResponseTypes.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerSkin } from '../../../utils/minecraft/mojangApi.js';
import makeWebRequest from '../../../utils/misc/makeWebRequest.js';
import config from '../../../utils/misc/readConfig.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('You must provide a player!', message);

  const antiSniperData: FindNickEndPoint = await makeWebRequest(
    `https://api.antisniper.net/findnick?key=${config.antiSniperApiKey}&name=${args[0]}`,
  );

  if (antiSniperData === null || !antiSniperData.success)
    return error('Failed to reach antisniper API.', message);

  if (!antiSniperData.player || antiSniperData.data === null)
    return error('I couldn\'t find that player\'s nick', message);

  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(`Find Nick`)
        .setDescription(
          `Nick: ${antiSniperData.player.nick}\n` +
          `IGN: ${args[0]}\n` +
          '*Embed is temporary, will be replaced with image soon*')
        .setImage(getPlayerSkin(antiSniperData.player.uuid)),
    ],
  });
}

export const description: DescriptionTypes = {
  name: 'findnick',
  category: 'minecraft',
  description: 'Uses antisniper API to find a player\'s nick',
  usage: '<player>',
};