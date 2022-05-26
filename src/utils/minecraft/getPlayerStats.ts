import fetch from 'node-fetch';
import hypixelResponseTypes from '../../types/hypixelResponseTypes.js';
import config from '../readConfig.js';

export default async function (playerUuid: string) {
  let data: hypixelResponseTypes;
  try {
    let response = await fetch(`https://api.hypixel.net/player?uuid=${playerUuid}&key=${config.hypixelApiKey}`);

    data = await response.json();

    if (!data.success)
      return false;

    return data.player;
  } catch (error) {
    return false;
  }
}