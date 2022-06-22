import { Invite, Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import getTargetUser from '../../../utils/discord/getTargetUser.js';
import error from '../../responses/error.js';
import botColors from '../../../utils/discord/botColors.js';

export default async function (message: Message, args: string[]) {

  if (!message.guild)
    return error('Please use this command in a guild', description.name, message);

  const user = await getTargetUser(message, args[0]);

  if (typeof user === 'boolean')
    return error('Couldn\'t fetch that user', description.name, message);

  const allInvites = message.guild.invites.cache;

  const userInvites = allInvites?.filter((value: Invite) => value.inviter?.id === message.author.id);

  const userInvitesCount = 0;
  let userInviteCodes;

  if (userInvites !== undefined) {
    userInvites.forEach(invite => userInvitesCount + (invite.uses || 0));
    userInviteCodes = userInvites?.map(i => i.code).join('\n');
  }

  const embed = new MessageEmbed()
    .setTitle(`${user.tag}'s invite count`)
    .setColor(botColors[1])
    .addField('Invite Count', String(userInvitesCount))
    .addField('Invite Codes', userInviteCodes || 'None')
    .setFooter({
      text: message.guild.name,
      iconURL: message.guild.iconURL() || undefined,
    });

  message.channel.send({embeds: [embed]});
}

export const description: DescriptionTypes = {
  name: 'invites',
  category: 'server',
  description: 'Checks the invite information of a user',
  usage: '<user>',
};