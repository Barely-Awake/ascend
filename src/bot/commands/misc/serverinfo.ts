import { EmbedBuilder, Message } from 'discord.js';
import { botEmojis } from '../../../utils/discord/botData.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import { resolveGuild } from '../../../utils/discord/resolveTarget.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import error from '../../responses/error.js';
import { DescriptionTypes } from '../_example.js';

export default async function (message: Message, args: string[]) {
  const server = await resolveGuild(message, args[0]);

  if (server === null)
    return error('Couldn\'t find a valid server', description.name, message);

  await Promise.all([
    server.fetch(),
    server.members.fetch({withPresences: true}),
    server.channels.fetch(),
    server.roles.fetch(),
    server.emojis.fetch(),
  ]);

  const guildRoles = server.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()),
    guildMembers = server.members.cache,
    guildPresences = server.presences.cache,
    guildChannels = server.channels.cache,
    guildEmojis = server.emojis.cache;

  const guildCreationDate = unixToSeconds(server.createdTimestamp);

  const statusCounts = [0, 0, 0];
  guildPresences.forEach((v) => {
    switch (v.status) {
      case 'online':
        statusCounts[0]++;
        break;
      case 'idle':
        statusCounts[1]++;
        break;
      case 'dnd':
        statusCounts[2]++;
        break;
    }
  });

  let embed = new EmbedBuilder()
    .setTitle(`Server info on \`${server.name}\``)
    .setDescription(server.description ? server.description : '')
    .addFields([
      {
        name: 'General',
        value: [
          `Owner: <@${server.ownerId}>`,
          `ID: ${server.id}`,
          `Level: ${server.premiumTier.toLocaleString() || 'Unknown'}`,
          `Created: ${messageTimeStamp(guildCreationDate)} (${messageTimeStamp(guildCreationDate, 'R')})`,
        ].join('\n'),
      },
      {
        name: 'Counts',
        value: [
          `Users: ${guildMembers.filter(member => !member.user.bot).size}`,
          `Bots: ${guildMembers.filter(member => member.user.bot).size}`,
          `Boosts: ${server.premiumSubscriptionCount || 0}`,
          `Channels: ${(guildChannels.size).toLocaleString()}`,
          `Roles: ${(guildRoles.length).toLocaleString()}`,
          `Emojis: ${guildEmojis.size}`,
        ].join('\n'),
      },
      {
        name: 'Activity',
        value: [
          `Online ${botEmojis.online}: ${statusCounts[0]}`,
          `Idle ${botEmojis.idle}: ${statusCounts[1]}`,
          `Do Not Disturb ${botEmojis.dnd}: ${statusCounts[2]}`,
          `Offline ${botEmojis.offline}: ${server.memberCount - (statusCounts[0] + statusCounts[1] + statusCounts[2])}`,
        ].join('\n'),
      },
    ]);

  const iconUrl = server.iconURL({size: 4096});

  if (iconUrl !== null && iconUrl !== undefined)
    embed = embed
      .setThumbnail(iconUrl);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'serverinfo',
  category: 'misc',
  aliases: ['server'],
  description: 'Provides information on the given server',
  usage: '[server]',
};