import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import error from '../../responses/error.js';
import fetch from 'node-fetch';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import { User } from '@saber2pr/types-github-api';
import { botColors } from '../../../utils/discord/botData.js';
import sharp from 'sharp';

export default async function (message: Message, args: string[]) {
  if (!args[0])
    return error('No user provided', description.name, message);

  const user = args.join('-');

  let userData: User;
  try {
    const response = await fetch(`https://api.github.com/users/${user}`);

    if (!response.ok)
      return error('User not found', description.name, message);

    userData = await response.json();
  } catch {
    return error('Error while fetching user data', description.name, message);
  }

  const timeCreated = unixToSeconds(Date.parse(userData.created_at));
  const timeUpdated = unixToSeconds(Date.parse(userData.updated_at));

  let embed = new MessageEmbed()
    .setTitle(`GitHub User \`${userData.login}\`${userData.name ? ` (${userData.name})` : ''}`)
    .setColor(botColors[1])
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

export const description: DescriptionTypes = {
  name: 'github',
  category: 'externalApis',
  description: 'Provides information on a GitHub user.',
  usage: '<user>',
};