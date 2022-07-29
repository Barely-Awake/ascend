import { EmbedBuilder, Message } from 'discord.js';
import { resolvePlayer } from '../../../utils/discord/resolveTarget.js';
import { getPlayerNames } from '../../../utils/minecraft/mojangApi.js';
import error from '../../responses/error.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();

  const mojangData = await resolvePlayer((args[0] || '').toLowerCase(), message);
  if (typeof mojangData === 'string')
    return error(mojangData, description.name, message);

  if (mojangData.name === null) {
    const data = await getPlayerNames(mojangData.uuid);

    if (data === null)
      return error(`Couldn't fetch player's names`, description.name, message);

    mojangData.name = data[data.length - 1].name;
  }

  const visageUrl = `https://visage.surgeplay.com/full/4096/${mojangData.uuid}?tilt=0`;

  const embed = new EmbedBuilder()
    .setTitle(`${mojangData.name}'s skin`)
    .setDescription(`[Use this skin](https://www.minecraft.net/en-us/profile/skin/remote?url=${visageUrl})\n` +
      `[Player's NameMC](https://namemc.com/profile/${mojangData.name})`)
    .setThumbnail(`https://crafatar.com/avatars/${mojangData.uuid}?overlay`)
    .setImage(visageUrl);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'skin',
  category: 'minecraft',
  description: 'Shows a player\'s minecraft skin.',
  usage: '[player]',
};