import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getPlayerUuid from '../../../utils/minecraft/getPlayerUuid.js';
import error from '../../responses/error.js';
import playerModel from '../../../mongo/player.js';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('Please provide the account you want to link with', description.name, message);

  args[0] = (args[0] || '').replace(/-/g, '');

  let playerUuid;

  if (args[0].length !== 32)
    playerUuid = await getPlayerUuid(args[0]);

  await playerModel.updateOne({}, {$set: {uuid: playerUuid, discordId: message.author.id}});
}

export const description: DescriptionTypes = {
  name: 'link',
  description: 'Links your discord account to your minecraft account',
  usage: '<player>',
};