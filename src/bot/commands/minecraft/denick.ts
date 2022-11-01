import { CommandCategory } from '../../botData.js';
import { DenickEndPoint } from '../../../types/antiSniperResponseTypes.js';
import { Message } from 'discord.js';
import config from '../../../utils/misc/readConfig.js';
import { drawBedWarsCanvas } from './bedwars.js';
import { error } from '../../../utils/discord/responses.js';
import { getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';
import makeWebRequest from '../../../utils/misc/makeWebRequest.js';
import { requireArgs } from '../../../utils/discord/commandDecorators.js';

export default class Denick {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'denick',
    category: CommandCategory = 'minecraft',
    aliases: string[] | null = null,
    description = 'Uses antisniper API to denick a player',
    usage = '<nick>'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @requireArgs(1)
  async command(message: Message, args: string[]) {
    const antiSniperData: DenickEndPoint = await makeWebRequest(
      `https://api.antisniper.net/denick?key=${config.antiSniperApiKey}&nick=${args[0]}`
    );

    if (antiSniperData === null || !antiSniperData.success)
      return error('Failed to reach antisniper API.', message);

    if (!antiSniperData.player || antiSniperData.data === null)
      return error(
        'Player is not denickable, did you mean to use find nick?',
        message
      );

    const playerStats = await getPlayerStats(antiSniperData.player.uuid);
    if (playerStats === null)
      return message.reply("Couldn't get player stats from Hypixel's API");

    playerStats.nick = antiSniperData.player.nick;

    const canvas = await drawBedWarsCanvas(playerStats);

    await message.reply({
      files: [
        {
          attachment: canvas,
          name: `${playerStats.displayName}-top (i'm a top :weary:).png`,
        },
      ],
    });
  }
}
