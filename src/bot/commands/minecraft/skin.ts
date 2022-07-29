import { EmbedBuilder, Message } from 'discord.js';
import { resolvePlayer } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerNames, getPlayerSkin } from '../../../utils/minecraft/mojangApi.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();

  const mojangData = await resolvePlayer((args[0] || '').toLowerCase(), message);
  if (typeof mojangData === 'string')
    return error(mojangData, message);

  if (mojangData.name === null) {
    const data = await getPlayerNames(mojangData.uuid);

    if (data === null)
      return error(`Couldn't fetch player's names`, message);

    mojangData.name = data[data.length - 1].name;
  }

  const skinUrl = getPlayerSkin(mojangData.uuid);

  const embed = new EmbedBuilder()
    .setTitle(`${mojangData.name}'s skin`)
    .setDescription(`[Use this skin](https://www.minecraft.net/en-us/profile/skin/remote?url=${skinUrl})\n` +
      `[Player's NameMC](https://namemc.com/profile/${mojangData.name})`)
    .setThumbnail(`https://crafatar.com/avatars/${mojangData.uuid}?overlay`)
    .setImage(skinUrl);

  message.channel.send({embeds: [embed]});
}

export const commandInfo: CommandInfo = {
  name: 'skin',
  category: 'minecraft',
  description: 'Shows a player\'s minecraft skin.',
  usage: '[player]',
};