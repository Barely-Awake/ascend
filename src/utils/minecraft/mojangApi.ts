import fetch from 'node-fetch';
import { NameHistory, PlayerUuid } from '../../types/mojangApiTypes.js';

export async function getPlayerUuid(playerName: string) {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);

    if (!response.ok)
      return null;

    const data: PlayerUuid = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

export async function getPlayerNames(playerUuid: string) {
  try {
    const response = await fetch(`https://api.mojang.com/user/profiles/${playerUuid}/names`);

    if (!response.ok)
      return null;

    const data: NameHistory = await response.json();

    return data;
  } catch {
    return null;
  }
}

export function getPlayerSkin(playerUuid: string) {
  return `https://visage.surgeplay.com/full/4096/${playerUuid}?tilt=0`;
}
