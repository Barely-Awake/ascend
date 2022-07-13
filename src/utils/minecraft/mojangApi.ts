import fetch from 'node-fetch';
import { NameHistory, PlayerUuid } from '../../types/mojangApiTypes.js';

export async function getPlayerUuid(playerName: string) {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
    const data: PlayerUuid = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

export async function getPlayerNames(playerUuid: string) {
  try {
    const response = await fetch(`https://api.mojang.com/user/profiles/${playerUuid}/names`);
    const data: NameHistory = await response.json();

    return data;
  } catch {
    return null;
  }
}