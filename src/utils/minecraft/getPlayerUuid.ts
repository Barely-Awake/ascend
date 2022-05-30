import fetch from 'node-fetch';
import PlayerUuid from '../../types/mojangApi/playerUuid.js';

export default async function (playerName: string) {
  try {
    let response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
    let data: PlayerUuid = await response.json();

    return data;
  } catch (error) {
    return false;
  }
}