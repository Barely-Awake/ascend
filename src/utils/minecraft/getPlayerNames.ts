import fetch from 'node-fetch';
import NameHistory from '../../types/mojangApi/nameHistory.js';

export default async function (playerUuid: string) {
  try {
    let response = await fetch(`https://api.mojang.com/user/profiles/${playerUuid}/names`);
    let data: NameHistory = await response.json();

    return data;
  } catch {
    return false;
  }
}