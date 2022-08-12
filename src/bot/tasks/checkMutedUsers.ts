import { Client } from 'discord.js';
import { MutedUserData } from '../../mongo/guildData.js';
import { TaskClass } from './_task.js';

export default class CheckMutedUsers implements TaskClass {
  public name: string;
  public interval: number;

  constructor(
    name = 'CheckMutedUsers',
    interval = 60 * 1000,
  ) {
    this.name = name;
    this.interval = interval;
  }

  async task(client: Client) {
    const currentTime = +new Date();
    const usersToBeUnMuted = await MutedUserData.find({
      expiresAt: {
        $lte: (+new Date()) + 61 * 1000,
        $gt: currentTime,
      },
    });

    if (!usersToBeUnMuted)
      return;

    usersToBeUnMuted.forEach((v) => {
      setTimeout(async () => {
        let guild = client.guilds.cache.get(v.guildId) || await client.guilds.fetch(v.guildId);

        if (!guild)
          return;

      }, v.expiresAt || 10 * 1000);
    });
  }
}
