import { Message, Role } from 'discord.js';
import { GuildData } from '../../../mongo/guildData.js';
import {
  onlyInGuild,
  requireArgs,
  requireBotPermission,
  requirePermission,
} from '../../../utils/discord/commandDecorators.js';
import { resolveRole } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import config from '../../../utils/misc/readConfig.js';
import { CommandCategory } from '../../botData.js';

export default class MuteRole {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'muterole',
    category: CommandCategory = 'config',
    aliases: string[] | null = null,
    description = 'Lets you set a custom mute role or makes one for you.',
    usage = '<set|make> [role]'
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
  @requireBotPermission('ManageRoles')
  async command(message: Message<true>, args: string[]) {
    let muteRole: Role;
    if (args[0] === 'make') {
      const role = await createMuteRole(message);
      if (!role) return error('Could not create mute role.', message);

      muteRole = role;
    } else if (args[0] === 'set') {
      const role = await resolveRole(message, args[1]);

      if (!role) return error('Please provide a role', message);

      muteRole = role;
    } else {
      return error('Please provide valid arguments', message);
    }

    let guild = (await GuildData.find({ serverId: message.guild.id }))[0];

    if (guild === undefined)
      guild = new GuildData({
        serverId: message.guild.id,
        prefix: config.prefix,
      });

    guild.muteRole = muteRole.id;
    guild.save();

    return message.reply('Mute role successfully configured!');
  }
}

async function createMuteRole(message: Message<true>) {
  const muteRole = await message.guild.roles.create({
    name: 'Muted',
    color: '#000000',
    reason: 'Setting up a mute role',
  });

  if (muteRole === undefined) {
    await error(
      'I couldn\'t create a mute role, do I have the correct permissions?',
      message
    );
    return null;
  }

  await message.guild.channels.fetch();
  if (!message.guild.channels.cache) return muteRole;

  message.guild.channels.cache.forEach((channel) => {
    if (channel.isThread()) return;

    if (channel.isTextBased()) {
      channel.permissionOverwrites.create(muteRole, {
        SendMessages: false,
        SendMessagesInThreads: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false,
        AddReactions: false,
      });
    } else if (channel.isVoiceBased()) {
      channel.permissionOverwrites.create(muteRole, {
        Connect: false,
        Speak: false,
        Stream: false,
        UseEmbeddedActivities: false,
      });
    }
  });

  return muteRole;
}
