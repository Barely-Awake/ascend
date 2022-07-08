import fetch from 'node-fetch';
import hypixelResponseTypes from '../../types/hypixelResponseTypes.js';
import config from '../misc/readConfig.js';

export default async function getPlayerStats(playerUuid: string) {
  let data: hypixelResponseTypes;
  try {
    const response = await fetch(`https://api.hypixel.net/player?uuid=${playerUuid}&key=${config.hypixelApiKey}`);

    data = await response.json();

    if (!data.success)
      return false;

    return data.player || false;
  } catch (error) {
    return false;
  }
}