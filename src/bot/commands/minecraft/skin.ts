import { resolvePlayer } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import {
  getPlayerNames,
  getPlayerSkin,
} from '../../../utils/minecraft/mojangApi.js';
import { CommandCategory } from '../../botData.js';
import { EmbedBuilder, Message } from 'discord.js';

export default class Skin {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'skin',
    category: CommandCategory = 'minecraft',
    aliases: string[] | null = null,
    description = "Shows a player's minecraft skin.",
    usage = '[player]'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, args: string[]) {
    const mojangData = await resolvePlayer(
      (args[0] || '').toLowerCase(),
      message
    );
    if (typeof mojangData === 'string') {
      return error(mojangData, message);
    }

    if (mojangData.name === null) {
      const data = await getPlayerNames(mojangData.uuid);

      if (data === null) {
        return error("Couldn't fetch player's names", message);
      }

      mojangData.name = data[data.length - 1].name;
    }

    const skinUrl = getPlayerSkin(mojangData.uuid);

    const embed = new EmbedBuilder()
      .setTitle(`${mojangData.name}'s skin`)
      .setDescription(
        `[Use this skin](https://www.minecraft.net/en-us/profile/skin/remote?url=${skinUrl})\n` +
          `[Player's NameMC](https://namemc.com/profile/${mojangData.name})`
      )
      .setThumbnail(`https://crafatar.com/avatars/${mojangData.uuid}?overlay`)
      .setImage(skinUrl);

    message.channel.send({ embeds: [embed] });
  }
}
