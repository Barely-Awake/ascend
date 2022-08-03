import { Message } from 'discord.js';
import playerModel from '../../mongo/player.js';
import { getPlayerUuid } from '../minecraft/mojangApi.js';

export async function resolveUser(message: Message, argument: string) {
  let user;

  try {
    if (!argument)
      user = message.author;
    else if (message.mentions.users.first())
      user = message.mentions.users.first();
    else
      // If there is no mentions then fetches user from id
      user = await message.client.users.fetch(argument);
  } catch {
    return null;
  }

  if (user === undefined)
    user = message.author;

  return user;
}

export async function resolveGuild(message: Message, argument: string) {
  let target;

  try {
    if (!argument && message.inGuild())
      target = await message.client.guilds.fetch({guild: message.guildId, withCounts: true});
    else if (argument)
      target = await message.client.guilds.fetch({guild: argument, withCounts: true});
    else
      return null;
  } catch {
    return null;
  }

  if (target === undefined)
    return null;

  return target;
}

export function resolveRole(message: Message, argument: string) {
  const firstRoleMention = message.mentions.roles.first();
  if (firstRoleMention !== undefined)
    return firstRoleMention;
  else if (argument)
    return message.guild?.roles.fetch(argument);

  return null;
}

export async function resolvePlayer(argument: string, message: Message) {
  const player = (argument || '').replace(/-/g, '');
  let mojangData: MojangData;

  if (!argument) {
    let dataBaseInfo;
    try {
      dataBaseInfo = await playerModel.findOne({discordId: message.author.id});
    } catch {
      dataBaseInfo = null;
    }

    if (dataBaseInfo === null)
      return 'You must be linked to not have to provide a player name. ' +
        'To see how to do that please view this image (https://catboymaid.club/Z96boeByYUZd) ';

    mojangData = {
      uuid: dataBaseInfo.playerUuid,
      name: null,
    };
  } else if (argument.length !== 32) {
    const data = await getPlayerUuid(player);

    if (data === null)
      return `Couldn't fetch player's uuid`;

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
