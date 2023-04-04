import { GuildMember, PermissionsBitField } from 'discord.js';
import { ParsedPermissionsStrings } from './ParsedPermissionsStrings.js';

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

/**
 * Checks if the given user has all permissions in the provided array.
 * If they don't, it returns the missing permissions (formatted) otherwise returns null.
 */
export function getMissingPermissions(
  user: GuildMember,
  permissions: PermissionsBitField
): string[] | null {
  const missingPermissions = user.permissions.missing(permissions);

  if (missingPermissions.length === 0) {
    return null;
  }

  return missingPermissions.map(
    (permission) => ParsedPermissionsStrings[permission]
  );
}
