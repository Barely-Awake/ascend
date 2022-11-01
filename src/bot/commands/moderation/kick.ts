import { Message } from 'discord.js';
import {
  onlyInGuild,
  requireArgs,
  requireBotPermission,
  requirePermission,
} from '../../../utils/discord/commandDecorators.js';
import { canModerateUser } from '../../../utils/discord/misc.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { CommandCategory } from '../../botData.js';

export default class Kick {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'kick',
    category: CommandCategory = 'moderation',
    aliases: string[] | null = null,
    description = 'Kick the target user',
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
  @requirePermission('KickMembers')
  @requireBotPermission('KickMembers')
  async command(message: Message, args: string[]) {
    const user = await resolveUser(message, args[0]);
    args.shift();
    const reason = args.join(' ');

    if (user === null)
      return error(
        "I couldn't find that user, make sure you're providing a mention or id",
        message
      );

    if (user.id === message.author.id)
      return error(
        "I'm going to assume you don't want to kick yourself " +
          "(If you did want that, there's a leave server button instead)",
        message
      );

    const target = await message.guild!.members.resolve(user);

    if (target === null || target === undefined) {
      await message.guild!.members.kick(user, reason || 'None');
    } else {
      if (!canModerateUser(message.member!, target, message.guild!.ownerId))
        return error(
          "You can't kick that user, is your role higher than theirs?",
          message
        );

      if (!target.kickable)
        return error(
          "I can't kick that user, make sure my role is higher than theirs",
          message
        );

      await target.kick(reason || 'None');
    }

    return message.channel.send(
      `Successfully kicked ${user.toString()} (\`${user.tag}\`) for ${
        reason || 'None'
      }`
    );
  }
}
