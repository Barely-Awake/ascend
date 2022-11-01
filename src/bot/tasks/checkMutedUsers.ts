import { Client } from 'discord.js';
import { MutedUserData } from '../../mongo/guildData.js';
import { TaskClass } from './_task.js';

export default class CheckMutedUsers implements TaskClass {
  public name: string;
  public interval: number;

  constructor(name = 'CheckMutedUsers', interval = 60 * 1000) {
    this.name = name;
    this.interval = interval;
  }

  async task(client: Client) {
    const usersToBeUnMuted = await MutedUserData.find({
      expiresAt: {
        $lte: Date.now() + 61 * 1000,
      },
    });

    if (!usersToBeUnMuted) return;

    usersToBeUnMuted.forEach((muteData) => {
      setTimeout(async () => {
        const guild =
          client.guilds.cache.get(muteData.guildId) ||
          (await client.guilds.fetch(muteData.guildId));
        if (!guild) return;

        const mutedUser =
          guild.members.cache.get(muteData.userId) ||
          (await guild.members.fetch(muteData.userId));
        if (!mutedUser || !mutedUser.manageable) return;

        try {
          await mutedUser.roles.remove(muteData.muteRoleId);
          await MutedUserData.deleteOne({
            guildId: muteData.guildId,
            userId: muteData.userId,
            expiresAt: muteData.expiresAt,
          });
        } catch {
          console.log('Failed to unmute user');
        }
      }, muteData.expiresAt || 10 * 1000);
    });
  }
}
