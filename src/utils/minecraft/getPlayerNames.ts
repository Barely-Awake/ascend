import fetch from 'node-fetch';
import NameHistory from '../../types/mojangApi/nameHistory.js';

export default async function (playerUuid: string) {
  try {
    const response = await fetch(`https://api.mojang.com/user/profiles/${playerUuid}/names`);
    const data: NameHistory = await response.json();

    return data;
  } catch {
    return false;
  }
}