import playerModel from '../../mongo/player.js';
import error from '../../bot/responses/error.js';
import { description } from '../../bot/commands/minecraft/skin.js';
import { Message } from 'discord.js';
import getPlayerUuid from '../minecraft/getPlayerUuid.js';

export default async function resolvePlayer(argument: string, message: Message) {
  const player = (argument || '').replace(/-/g, '');
  let mojangData: MojangData;

  if (!argument) {
    let dataBaseInfo;
    try {
      dataBaseInfo = await playerModel.findOne({discordId: message.author.id});
    } catch {
      dataBaseInfo = null;
    }

    if (dataBaseInfo === null) {
      error('You must be linked to not have to provide a player name. ' +
        'To see how to do that please view this image (https://catboymaid.club/Z96boeByYUZd) ', description.name, message);
      return false;
    }

    mojangData = {
      uuid: dataBaseInfo.playerUuid,
      name: null,
    };
  } else if (argument.length !== 32) {
    const data = await getPlayerUuid(player);

    if (typeof data === 'boolean') {
      error(`Couldn't fetch player's uuid`, description.name, message);
      return false;
    }

    mojangData = {
      uuid: data.id,
      name: data.name,
    };
  } else {
    mojangData = {
      uuid: argument,
      name: null,
    };
  }
  return mojangData;
}

interface MojangData {
  uuid: string;
  name: null | string;
}