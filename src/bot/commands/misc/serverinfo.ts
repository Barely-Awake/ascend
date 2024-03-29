import { messageTimeStamp } from '../../../utils/discord/misc.js';
import { resolveGuild } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { unixToSeconds } from '../../../utils/misc/time.js';
import { CommandCategory, botEmojis } from '../../botData.js';
import { EmbedBuilder, Message } from 'discord.js';

export default class ServerInfo {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'serverinfo',
    category: CommandCategory = 'misc',
    aliases: string[] | null = ['server'],
    description = 'Provides information on the given server',
    usage = '[server]'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, args: string[]) {
    const server = await resolveGuild(message, args[0]);

    if (server === null) {
      return error("Couldn't find a valid server", message);
    }

    await Promise.all([
      server.fetch(),
      server.members.fetch({ withPresences: true }),
      server.channels.fetch(),
      server.roles.fetch(),
      server.emojis.fetch(),
    ]);

    const guildRoles = server.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString()),
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
            `Created: ${messageTimeStamp(
              guildCreationDate
            )} (${messageTimeStamp(guildCreationDate, 'R')})`,
          ].join('\n'),
        },
        {
          name: 'Counts',
          value: [
            `Users: ${guildMembers.filter((member) => !member.user.bot).size}`,
            `Bots: ${guildMembers.filter((member) => member.user.bot).size}`,
            `Boosts: ${server.premiumSubscriptionCount || 0}`,
            `Channels: ${guildChannels.size.toLocaleString()}`,
            `Roles: ${guildRoles.length.toLocaleString()}`,
            `Emojis: ${guildEmojis.size}`,
          ].join('\n'),
        },
        {
          name: 'Activity',
          value: [
            `Online ${botEmojis.online}: ${statusCounts[0]}`,
            `Idle ${botEmojis.idle}: ${statusCounts[1]}`,
            `Do Not Disturb ${botEmojis.dnd}: ${statusCounts[2]}`,
            `Offline ${botEmojis.offline}: ${
              server.memberCount -
              (statusCounts[0] + statusCounts[1] + statusCounts[2])
            }`,
          ].join('\n'),
        },
      ]);

    const iconUrl = server.iconURL({ size: 4096 });

    if (iconUrl !== null && iconUrl !== undefined) {
      embed = embed.setThumbnail(iconUrl);
    }

    await message.reply({ embeds: [embed] });
  }
}
