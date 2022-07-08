import fetch from 'node-fetch';
import PlayerUuid from '../../types/mojangApi/playerUuid.js';
import NameHistory from '../../types/mojangApi/nameHistory.js';

export async function getPlayerUuid(playerName: string) {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
    const data: PlayerUuid = await response.json();

    return data;
  } catch (error) {
    return false;
  }
}

export async function getPlayerNames(playerUuid: string) {
  try {
    const response = await fetch(`https://api.mojang.com/user/profiles/${playerUuid}/names`);
    const data: NameHistory = await response.json();

    return data;
  } catch {
    return false;
  }
}