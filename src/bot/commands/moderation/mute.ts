import { Message } from 'discord.js';
import ms from 'ms';
import { GuildData, MutedUserData } from '../../../mongo/guildData.js';
import { onlyInGuild, requireBotPermission, requirePermission } from '../../../utils/discord/commandDecorators.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { CommandCategory } from '../../botData.js';

export default class Mute {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'mute',
    category: CommandCategory = 'moderation',
    aliases: string[] | null = null,
    description = 'Mutes the target user for the provided duration (Or forever)',
    usage = '<user> [duration] [reason]',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @onlyInGuild()
  @requirePermission('ManageRoles')
  @requireBotPermission('ManageRoles')
  async command(message: Message<true>, args: string[]) {
    const user = await resolveUser(message, args[0]);
    args.shift();

    if (user == null) return message.reply('Could not find target user.');

    const guildMember = await message.guild.members.fetch(user.id);

    if (!guildMember)
      return message.reply(
        'Could not find target user in this guild. Are they a member?',
      );

    let duration: number | null;
    try {
      duration = args[0] ? ms(args[0]) : null;

      if (duration === null ? false : isNaN(duration)) duration = null;
    } catch (err) {
      if (err === 'Value exceeds the maximum length of 100 characters.')
        duration = null;
      else
        return message.reply(
          'Please provide a valid duration, for example: `1d` (1 day).',
        );
    }

    if (duration !== null) {
      args.shift();
    }

    const reason = args.join(' ');
    const guildData = await GuildData.findOne({serverId: message.guild.id});

    if (!guildData || !guildData.muteRole)
      return message.reply(
        'Please set up a mute role using the `muterole` command',
      );

    try {
      await guildMember.roles.add(guildData.muteRole, reason);
    } catch {
      return message.reply(
        'The mute role configured for this guild could not be added to that user. ' +
        'Try setting it up again using the `muterole` command.',
      );
    }

    await MutedUserData.create({
      guildId: message.guild.id,
      userId: guildMember.id,
      muteRoleId: guildData.muteRole,
      expiresAt: duration || undefined,
    });

    await message.reply(
      `Successfully muted ${guildMember.toString()}${
        reason ? ` for ${reason}` : ''
      }`,
    );
  }
}
