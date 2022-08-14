import { User } from '@saber2pr/types-github-api';
import { EmbedBuilder, Message } from 'discord.js';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { CommandCategory } from '../../../types/discord.js';
import { botColors } from '../../../utils/discord/botData.js';
import { requireArgs } from '../../../utils/discord/commandDecorators.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import { error } from '../../../utils/discord/responses.js';
import { unixToSeconds } from '../../../utils/misc/time.js';

export default class GitHub {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'github',
    category: CommandCategory = 'externalApis',
    aliases: string[] | null = null,
    description = 'Provides information on a GitHub user.',
    usage = '<user>',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @requireArgs(1)
  async command(message: Message, args: string[]) {
    const user = args.join('-');

    let userData: User;
    try {
      const response = await fetch(`https://api.github.com/users/${user}`);

      if (!response.ok)
        return error('User not found', message);

      userData = await response.json();
    } catch {
      return error('Error while fetching user data', message);
    }

    const timeCreated = unixToSeconds(Date.parse(userData.created_at));
    const timeUpdated = unixToSeconds(Date.parse(userData.updated_at));

    let embed = new EmbedBuilder()
      .setTitle(`GitHub User \`${userData.login}\`${userData.name ? ` (${userData.name})` : ''}`)
      .setColor(botColors[1])
      .setThumbnail(userData.avatar_url)
      .setDescription(userData.bio || 'Unknown')
      .setURL(userData.html_url)
      .addFields([
        {
          name: 'Created',
          value: `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`,
        },
        {
          name: 'Updated',
          value: `${messageTimeStamp(timeUpdated)} (${messageTimeStamp(timeUpdated, 'R')})`,
        },
        {
          name: 'Website',
          value: userData.blog ? userData.blog : 'Unknown',
        },
        {
          name: 'Email',
          value: userData.email ? userData.email : 'Unknown',
        },
        {
          name: 'Public Repos',
          value: String(userData.public_repos),
        },
        {
          name: 'Public Gists',
          value: String(userData.public_gists),
        },
        {
          name: 'Followers',
          value: String(userData.followers),
        },
        {
          name: 'Following',
          value: String(userData.following),
        },
      ]);

    let contributionGraph;
    try {
      const response = await fetch(`https://ghchart.rshah.org/5865F2/${userData.login.toLocaleLowerCase()}`);

      if (response.ok)
        contributionGraph = Buffer.from(await response.arrayBuffer()); // Converts response to svg file buffer
      else
        contributionGraph = false;
    } catch {
      contributionGraph = false;
    }
    if (typeof contributionGraph === 'boolean')
      return message.channel.send({
        embeds: [embed],
      });

    // Sets the embed image to the provided attachment on the message.
    embed = embed.setImage(`attachment://${userData.login.toLocaleLowerCase()}-graph.png`);

    message.channel.send({
      embeds: [embed],
      files: [
        {
          name: `${userData.login.toLocaleLowerCase()}-graph.png`,
          attachment: sharp(contributionGraph).png(), // Converts svg to png
        },
      ],
    });
  }
}
