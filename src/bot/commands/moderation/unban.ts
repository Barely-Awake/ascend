import { Message } from 'discord.js';
import {
  onlyInGuild,
  requireArgs,
  requireBotPermission,
  requirePermission,
} from '../../../utils/discord/commandDecorators.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { CommandCategory } from '../../botData.js';

export default class Unban {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'unban',
    category: CommandCategory = 'moderation',
    aliases: string[] | null = null,
    description = 'Unbans the target user',
    usage = '<user> [reason]'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @onlyInGuild()
  @requireArgs(1)
  @requirePermission('BanMembers')
  @requireBotPermission('BanMembers')
  async command(message: Message<true>, args: string[]) {
    const user = await resolveUser(message, args[0]);
    args.shift();
    const reason = args.join(' ');

    if (user === null) {
      return error(
        "I couldn't find that user, make sure you're providing a mention or id",
        message
      );
    }

    await message.guild.bans.remove(user, reason || 'None');

    return message.channel.send(
      `Successfully unbanned ${user.toString()} (\`${user.tag}\`) for ${
        reason || 'None'
      }`
    );
  }
}
