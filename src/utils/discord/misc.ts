import { GuildMember, PermissionResolvable } from 'discord.js';

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
 * Checks if the given user has all permissions in provided array.
 * If they don't the missing permissions otherwise returns null
 */
export function findRequiredPermission(
  user: GuildMember,
  permissions: PermissionResolvable[]
): PermissionResolvable[] | null {
  const requiredPermissions: PermissionResolvable[] = [];
  for (const permission of permissions) {
    if (!user.permissions.has(permission)) {
      requiredPermissions.push(permission);
    }
  }

  return requiredPermissions || null;
}
