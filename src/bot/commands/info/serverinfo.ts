import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getTargetGuild from '../../../utils/discord/getTargetGuild.js';
import error from '../../responses/error.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import premiumTiers from '../../../utils/discord/premiumTiers.js';
import botEmojis from '../../../utils/discord/botEmojis.js';

export default async function (message: Message, args: string[]) {
  const server = await getTargetGuild(message, args[0]);

  if (typeof server === 'boolean')
    return error('Couldn\'t find a valid server', description.name, message);

  const guildRoles = server.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()),
    guildMembers = server.members.cache,
    guildPresences = server.presences.cache,
    guildChannels = server.channels.cache,
    guildEmojis = server.emojis.cache;

  const guildCreationDate = unixToSeconds(server.createdTimestamp);

  let statusCounts = [0, 0, 0];
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
  console.log(server.iconURL, 'h');

  let embed = new MessageEmbed()
    .setTitle(`Server info on \`${server.name}\``)
    .setDescription(server.description ? server.description : '')
    .addField('General',
      [
        `Owner: <@${server.ownerId}>`,
        `ID: ${server.id}`,
        `Level: ${premiumTiers[server.premiumTier]}`,
        `Created: ${messageTimeStamp(guildCreationDate)} (${messageTimeStamp(guildCreationDate, 'R')})`,
      ].join('\n'),
    )
    .addField('Counts',
      [
        `Users: ${guildMembers.filter(member => !member.user.bot).size}`,
        `Bots: ${guildMembers.filter(member => member.user.bot).size}`,
        `Boosts: ${server.premiumSubscriptionCount || 0}`,
        `Channels: ${guildChannels.size}`,
        `Roles: ${guildRoles.length}`,
        `Emojis: ${guildEmojis.size}`,
      ].join('\n'),
    )
    .addField('Activity',
      [
        `Online ${botEmojis.online}: ${statusCounts[0]}`,
        `Idle ${botEmojis.idle}: ${statusCounts[1]}`,
        `Do Not Disturb ${botEmojis.dnd}: ${statusCounts[2]}`,
        `Offline ${botEmojis.offline}: ${server.memberCount - (statusCounts[0] + statusCounts[1] + statusCounts[2])}`,

      ].join('\n'));

  let iconUrl = server.iconURL({dynamic: true});

  if (iconUrl !== null && iconUrl !== undefined)
    embed = embed
      .setThumbnail(iconUrl);

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'serverinfo',
  aliases: ['server'],
  description: 'Provides information on the given server',
  usage: '[server]',
};