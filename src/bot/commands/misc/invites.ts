import { EmbedBuilder, Invite, Message } from 'discord.js';
import { botColors } from '../../../utils/discord/botData.js';
import { resolveUser } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();

  if (!message.guild)
    return error('Please use this command in a guild', message);

  const user = await resolveUser(message, args[0]);

  if (user === null)
    return error('Couldn\'t fetch that user', message);

  await message.guild.invites.fetch();
  const allInvites = message.guild.invites.cache;

  const userInvites = allInvites?.filter((value: Invite) => value.inviter?.id === message.author.id);

  let userInvitesCount = 0;
  let userInviteCodes;

  if (userInvites !== undefined) {
    userInvites.forEach(invite => {
      userInvitesCount = userInvitesCount + (invite.uses || 0);
    });
    userInviteCodes = userInvites?.map(i => i.code).join('\n');
  }

  const embed = new EmbedBuilder()
    .setTitle(`${user.tag}'s invite count`)
    .setColor(botColors[1])
    .setFooter({
      text: message.guild.name,
      iconURL: message.guild.iconURL() || undefined,
    })
    .addFields([
      {
        name: 'Invite Count',
        value: userInvitesCount.toLocaleString(),
      },
      {
        name: 'Invite Codes',
        value: userInviteCodes || 'None',
      },
    ]);

  message.channel.send({embeds: [embed]});
}

export const commandInfo: CommandInfo = {
  name: 'invites',
  category: 'misc',
  description: 'Checks the invite information of a user',
  usage: '<user>',
};