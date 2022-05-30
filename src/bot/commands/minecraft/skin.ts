import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getPlayerUuid from '../../../utils/minecraft/getPlayerUuid.js';
import error from '../../responses/error.js';
import getPlayerNames from '../../../utils/minecraft/getPlayerNames.js';

export default async function (message: Message, args: string[]) {
  let player = args[0].replace(/-/g, '');

  let mojangData;
  if (player.length !== 32) {
    let data = await getPlayerUuid(player);

    if (typeof data === 'boolean')
      return error(`Couldn't fetch player's uuid`, description.name, message);

    mojangData = {
      uuid: data.id,
      name: data.name,
    };
  } else {
    let data = await getPlayerNames(player);

    if (typeof data === 'boolean')
      return error(`Couldn't fetch player's names`, description.name, message);

    mojangData = {
      uuid: args[0],
      name: data[data.length - 1].name,
    };
  }

  let embed = new MessageEmbed()
    .setTitle(`${mojangData.name}'s skin`)
    .setThumbnail(`https://crafatar.com/avatars/${mojangData.uuid}?overlay`)
    .setImage(`https://visage.surgeplay.com/full/${mojangData.uuid}?tilt=0`);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'skin',
  description: 'Shows a player\'s minecraft skin.',
  usage: '<player>',
};