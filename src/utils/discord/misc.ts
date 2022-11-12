import { GuildMember } from 'discord.js';

type ValidTimeStampStyles = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';

export function messageTimeStamp(
  timeStamp: number,
  style: ValidTimeStampStyles = 'f'
) {
  return `<t:${timeStamp}:${style}>`;
}

export function canModerateUser(
  user: GuildMember,
  target: GuildMember,
  guildOwnerId: string
) {
  if (user.id === guildOwnerId) {
    return true;
  }

  return (
    user.roles.highest.position > target.roles.highest.position &&
    target.id !== guildOwnerId
  );
}
