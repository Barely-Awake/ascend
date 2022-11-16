import { Message } from 'discord.js';
import { GuildData } from '../../../mongo/guildData.js';
import {
  onlyInGuild,
  requireArgs,
  requirePermission,
} from '../../../utils/discord/commandDecorators.js';
import { CommandCategory } from '../../botData.js';

export default class SetPrefix {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'setprefix',
    category: CommandCategory = 'guildConfig',
    aliases: string[] | null = null,
    description = 'Sets prefix in current guild',
    usage = '<prefix>'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @onlyInGuild()
  @requireArgs(1)
  @requirePermission('ManageGuild')
  async command(message: Message<true>, args: string[]) {
    const prefix = args.join(' ');

    const fetchedData = await GuildData.find({ serverId: message.guild.id });

    let guildInfo;
    if (fetchedData.length === 0) {
      guildInfo = new GuildData({
        serverId: message.guild.id,
        prefix: prefix,
      });
    } else {
      guildInfo = fetchedData[0];
    }

    guildInfo.prefix = prefix;
    guildInfo.save();
    message.client.cache.prefixes[message.guild.id] = prefix;
    await message.reply(`Successfully set prefix to ${prefix}`);
  }
}
