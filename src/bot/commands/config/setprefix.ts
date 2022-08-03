import { Message } from 'discord.js';
import { GuildData } from '../../../mongo/guildData.js';
import { CommandCategory } from '../../../types/discord.js';
import { onlyInGuild, requirePermission } from '../../../utils/discord/commandDecorators.js';
import { error } from '../../../utils/discord/responses.js';

export default class SetPrefix {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'setprefix',
    category: CommandCategory = 'config',
    aliases: string[] | null = null,
    description = 'Sets prefix in current guild',
    usage = '<prefix>',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @onlyInGuild()
  @requirePermission('ManageGuild')
  async command(message: Message, args: string[]) {
    if (!args || args[0] === undefined)
      return error('You have to provide a prefix', message);

    const prefix = args.join(' ');

    const fetchedData = await GuildData.find({serverId: message.guild!.id});

    let guildInfo;
    if (fetchedData.length === 0)
      guildInfo = new GuildData({serverId: message.guild!.id, prefix: prefix});
    else
      guildInfo = fetchedData[0];

    guildInfo.prefix = prefix;
    guildInfo.save();
    message.client.cache.prefixes[message.guild!.id] = prefix;
    message.channel.send(`Successfully set prefix to ${prefix}`);
  }
}
