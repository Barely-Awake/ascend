import { Message, Role } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import config from '../../../utils/misc/readConfig.js';
import resolveRole from '../../../utils/discord/resolveRole.js';
import GuildData from '../../../mongo/guildData.js';

export default async function (message: Message, args: string[]) {

  if (!message.member?.permissions.has('MANAGE_GUILD'))
    return error('You must have permission to manage the server to do that', description.name, message);

  let muteRole: Role;
  if (args[0] === 'make') {
    const role = await createMuteRole(message);
    if (!role)
      return;
    muteRole = role;
  } else if (args[0] === 'set') {
    const role = await resolveRole(message, args[1]);

    if (!role)
      return error('Please provide a role', description.name, message);

    muteRole = role;
  } else {
    return error('Please provide valid arguments', description.name, message);
  }

  let guild = (await GuildData.find({serverId: message.guild?.id}))[0];

  if (guild === undefined)
    guild = new GuildData({
      serverId: message.guild?.id,
      prefix: config.prefix,
    });

  guild.muteRole = muteRole.id;
  guild.save();

  return message.channel.send('Mute role successfully set!');
}

async function createMuteRole(message: Message) {
  const muteRole = await message.guild?.roles.create({
    name: 'Muted',
    color: '#000000',
    reason: 'Setting up a mute role',
  });

  if (muteRole === undefined) {
    error(
      `Couldn't create a mute role. Check to see if ${config.botName} has the create role permission`,
      description.name,
      message,
    );
    return;
  }

  await message.guild?.channels.fetch();
  const channelCache = message.guild?.channels.cache;
  if (!channelCache)
    return muteRole;
  for (let channelKey of channelCache) {
    const channel = channelKey[1];
    if (channel.isThread())
      continue;

    if (channel.isText()) {
      channel.permissionOverwrites.create(
        muteRole,
        {
          SEND_MESSAGES: false,
          SEND_MESSAGES_IN_THREADS: false,
          CREATE_PUBLIC_THREADS: false,
          CREATE_PRIVATE_THREADS: false,
          ADD_REACTIONS: false,
        });
    } else if (channel.isVoice()) {
      await channel.permissionOverwrites.create(
        muteRole,
        {
          CONNECT: false,
          SPEAK: false,
          STREAM: false,
          START_EMBEDDED_ACTIVITIES: false,
        },
      );
    }
  }

  return muteRole;
}

export const description: DescriptionTypes = {
  name: 'muterole',
  category: 'config',
  description: 'Lets you set a custom mute role or makes one for you.',
  usage: '<set|make> [role]',
};