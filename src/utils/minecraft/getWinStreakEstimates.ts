import fetch from 'node-fetch';
import config from '../misc/readConfig.js';
import keathizApiResponse from '../../types/keathizResponseTypes.js';

export default async function (playerUuid: string) {
  try {
    const response = await fetch(
      `https://api.antisniper.net/winstreak?key=${config.keathizApiKey}&uuid=${playerUuid}`,
    );

    if (!response.ok)
      return false;

    const data: keathizApiResponse = await response.json();

    if (!data.success || data.player === undefined || data.player === null)
      return false;

    const winStreakData = data.player.data;

    return {
      overAll: winStreakData.overall_winstreak || 0,
      eight_one: winStreakData.eight_one_winstreak || 0,
      eight_two: winStreakData.eight_two_winstreak || 0,
      four_three: winStreakData.four_three_winstreak || 0,
      four_four: winStreakData.four_four_winstreak || 0,
      two_four: winStreakData.two_four_winstreak || 0,
    };
  } catch {
    return false;
  }
}