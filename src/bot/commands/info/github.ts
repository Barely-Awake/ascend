import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import fetch from 'node-fetch';
import config from '../../../utils/readConfig.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import * as GitHubTypes from '@saber2pr/types-github-api';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('No user provided', description.name, message);

  let user = args.join('-');

  let userData: GitHubTypes.User;
  try {
    const response = await fetch(`https://api.github.com/users/${user}`);

    if (!response.ok)
      return error('User not found', description.name, message);

    userData = await response.json();
  } catch {
    return error('Error while fetching user data', description.name, message);
  }

  let timeCreated = unixToSeconds(Date.parse(userData.created_at));
  let timeUpdated = unixToSeconds(Date.parse(userData.updated_at));

  const embed = new MessageEmbed()
    .setTitle(`GitHub User \`${userData.login}\`${userData.name ? ` (${userData.name})` : ''}`)
    .setColor(config.colors[1])
    .setThumbnail(userData.avatar_url)
    .setDescription(userData.bio || 'Unknown')
    .setURL(userData.html_url)
    .addField('Created', `${messageTimeStamp(timeCreated)} (${messageTimeStamp(timeCreated, 'R')})`)
    .addField('Updated', `${messageTimeStamp(timeUpdated)} (${messageTimeStamp(timeUpdated, 'R')})`)
    .addField('Website', userData.blog ? userData.blog : 'Unknown')
    .addField('Email', userData.email ? userData.email : 'Unknown')
    .addField('Public Repos', String(userData.public_repos))
    .addField('Public Gists', String(userData.public_gists))
    .addField('Followers', String(userData.followers))
    .addField('Following', String(userData.following));

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'github',
  description: 'Provides information on a GitHub user.',
  usage: '<user>',
};