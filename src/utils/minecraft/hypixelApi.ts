import fetch from 'node-fetch';
import { WinStreakEndPoint } from '../../types/antiSniperResponseTypes.js';
import hypixelResponseTypes, { Player } from '../../types/hypixelResponseTypes.js';
import playerStatsTypes from '../../types/playerStatsTypes.js';
import config from '../misc/readConfig.js';

export async function getPlayerStats(playerUuid: string) {
  const hypixelData = await getHypixelData(playerUuid);
  if (hypixelData === null)
    return null;

  const playerStats = formatPlayerStats(hypixelData);
  if (!playerStats.bedWars.winStreakApiOn()) {
    const antiSniperWinStreakData = await getWinStreakEstimates(playerUuid);

    if (antiSniperWinStreakData !== null)
      playerStats.bedWars.winStreak = antiSniperWinStreakData;
  }

  return playerStats;
}

export async function getHypixelData(playerUuid: string) {
  let data: hypixelResponseTypes;
  try {
    const response = await fetch(`https://api.hypixel.net/player?uuid=${playerUuid}&key=${config.hypixelApiKey}`);

    if (!response.ok)
      return null;

    data = await response.json();

    if (!data.success)
      return null;

    return data.player || null;
  } catch (error) {
    return null;
  }
}

export async function getWinStreakEstimates(playerUuid: string) {
  try {
    const response = await fetch(
      `https://api.antisniper.net/winstreak?key=${config.antiSniperApiKey}&uuid=${playerUuid}`,
    );

    if (!response.ok)
      return null;

    const data: WinStreakEndPoint = await response.json();

    if (!data.success || data.player === undefined || data.player === null)
      return null;

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
    return null;
  }
}

export function calculateBedWarsLevel(experience: number): number {
  let level = Math.floor(experience / 487000) * 100;

  experience %= 487000;

  if (experience < 500)
    return level + experience / 500;
  level++;

  if (experience < 1500)
    return level + (experience - 500) / 1000;
  level++;

  if (experience < 3500)
    return level + (experience - 1500) / 2000;
  level++;

  if (experience < 7000)
    return level + (experience - 3500) / 3500;
  level++;

  experience -= 7000;

  return level + experience / 5000;
}

// Colors and getFormattedLevel were taken from Statsify Overlay (Though they've been modified)
export const colors: { [index: string]: string } = {
  '0': '#000000',
  '1': '#0000a8',
  '2': '#00a800',
  '3': '#00a8a8',
  '4': '#a80000',
  '5': '#a800a8',
  '6': '#ffaa00',
  '7': '#ababab',
  '8': '#545454',
  '9': '#5757FF',
  'a': '#57FF57',
  'b': '#57FFFF',
  'c': '#FF5757',
  'd': '#FF57FF',
  'e': '#FFFF57',
  'f': '#FFFFFF',
  'g': '#DCD504',
  's': '#2AA0F4',

  'k': 'obfuscated',
  'l': 'bold',
  'm': 'strikethrough',
  'n': 'underlined',
  'o': 'italic',
  'r': 'reset',
  '#': 'hex',
};

export function getFormattedLevel(star: number): string {
  star = Math.floor(star);

  const stars = ['@', '{', '}'];

  const prestigeColors: { req: number; fn: (n: number) => string }[] = [
    {req: 0, fn: (n) => `§7[${n}${stars[0]}]`},
    {req: 100, fn: (n) => `§f[${n}${stars[0]}]`},
    {req: 200, fn: (n) => `§6[${n}${stars[0]}]`},
    {req: 300, fn: (n) => `§b[${n}${stars[0]}]`},
    {req: 400, fn: (n) => `§2[${n}${stars[0]}]`},
    {req: 500, fn: (n) => `§3[${n}${stars[0]}]`},
    {req: 600, fn: (n) => `§4[${n}${stars[0]}]`},
    {req: 700, fn: (n) => `§d[${n}${stars[0]}]`},
    {req: 800, fn: (n) => `§9[${n}${stars[0]}]`},
    {req: 900, fn: (n) => `§5[${n}${stars[0]}]`},
    {
      req: 1000,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§b${nums[3]}§d${stars[0]}§5]`;
      },
    },
    {req: 1100, fn: (n) => `§7[§f${n}§7${stars[1]}]`},
    {req: 1200, fn: (n) => `§7[§e${n}§6${stars[1]}§7]`},
    {req: 1300, fn: (n) => `§7[§b${n}§3${stars[1]}§7]`},
    {req: 1400, fn: (n) => `§7[§a${n}§2${stars[1]}§7]`},
    {req: 1500, fn: (n) => `§7[§3${n}§9${stars[1]}§7]`},
    {req: 1600, fn: (n) => `§7[§c${n}§4${stars[1]}§7]`},
    {req: 1700, fn: (n) => `§7[§d${n}§5${stars[1]}§7]`},
    {req: 1800, fn: (n) => `§7[§9${n}§1${stars[1]}§7]`},
    {req: 1900, fn: (n) => `§7[§5${n}§8${stars[1]}§7]`},
    {
      req: 2000,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§8[§7${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}§8${stars[1]}]`;
      },
    },
    {
      req: 2100,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§f[${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}${stars[2]}§6]`;
      },
    },
    {
      req: 2200,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§6[${nums[0]}§f${nums[1]}${nums[2]}§b${nums[3]}§3${stars[2]}§3]`;
      },
    },
    {
      req: 2300,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§5[${nums[0]}§d${nums[1]}${nums[2]}§6${nums[3]}§e${stars[2]}§e]`;
      },
    },
    {
      req: 2400,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§b[${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}${stars[2]}§8]`;
      },
    },
    {
      req: 2500,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§f[${nums[0]}§a${nums[1]}${nums[2]}§2${nums[3]}${stars[2]}§2]`;
      },
    },
    {
      req: 2600,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§d${nums[3]}${stars[2]}§d]`;
      },
    },
    {
      req: 2700,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§e[${nums[0]}§f${nums[1]}${nums[2]}§8${nums[3]}${stars[2]}§8]`;
      },
    },
    {
      req: 2800,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§a[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}${stars[2]}§e]`;
      },
    },
    {
      req: 2900,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§b[${nums[0]}§3${nums[1]}${nums[2]}§9${nums[3]}${stars[2]}§1]`;
      },
    },
    {
      req: 3000,
      fn: (n) => {
        const nums = n.toString().split('');
        return `§e[${nums[0]}§6${nums[1]}${nums[2]}§c${nums[3]}${stars[2]}§4]`;
      },
    },
  ];

  const index = prestigeColors.findIndex(
    ({req}, index, arr) =>
      star >= req && ((arr[index + 1] && star < arr[index + 1].req) || !arr[index + 1]),
  );
  return prestigeColors[index].fn(star);
}

export function formatPlayerStats(playerStats: Player): playerStatsTypes {
  const bedWarsStats = playerStats.stats?.Bedwars;

  return <playerStatsTypes>{
    displayName: playerStats.displayname,
    uuid: playerStats.uuid,
    rank: getPlayerRank(playerStats),

    lastLogIn: playerStats.lastLogin || null,
    lastLogOut: playerStats.lastLogout || null,

    socialMedia: {
      hypixel: playerStats.socialMedia?.links?.HYPIXEL || null,
      discord: playerStats.socialMedia?.links?.DISCORD || null,
      twitch: playerStats.socialMedia?.links?.TWITCH || null,
      instagram: playerStats.socialMedia?.links?.INSTAGRAM || null,
      youtube: playerStats.socialMedia?.links?.YOUTUBE || null,
      twitter: playerStats.socialMedia?.links?.TWITTER || null,
    },

    bedWars: {
      experience: bedWarsStats?.Experience || 0,

      winStreakApiOn: function (this) {
        for (const mode in this.winStreak) {
          if (this.winStreak[mode] === null && this.wins[mode] !== 0)
            return false;
        }

        return true;
      },

      gamesPlayed: {
        overAll: bedWarsStats?.games_played_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_games_played_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_games_played_bedwars || 0,
        four_three: bedWarsStats?.four_three_games_played_bedwars || 0,
        four_four: bedWarsStats?.four_four_games_played_bedwars || 0,
        two_four: bedWarsStats?.two_four_games_played_bedwars || 0,
      },

      winStreak: {
        overAll: bedWarsStats?.winstreak !== undefined ? bedWarsStats?.winstreak : null,
        eight_one: bedWarsStats?.eight_one_winstreak !== undefined ? bedWarsStats?.eight_one_winstreak : null,
        eight_two: bedWarsStats?.eight_two_winstreak !== undefined ? bedWarsStats?.eight_two_winstreak : null,
        four_three: bedWarsStats?.four_three_winstreak !== undefined ? bedWarsStats?.four_three_winstreak : null,
        four_four: bedWarsStats?.four_four_winstreak !== undefined ? bedWarsStats?.four_four_winstreak : null,
        two_four: bedWarsStats?.two_four_winstreak !== undefined ? bedWarsStats?.two_four_winstreak : null,
      },
      winRate: {
        overAll: (bedWarsStats?.wins_bedwars || 0) / (bedWarsStats?.games_played_bedwars || 1),
        eight_one: (bedWarsStats?.eight_one_wins_bedwars || 0) / (bedWarsStats?.eight_one_games_played_bedwars || 1),
        eight_two: (bedWarsStats?.eight_two_wins_bedwars || 0) / (bedWarsStats?.eight_two_games_played_bedwars || 1),
        four_three: (bedWarsStats?.four_three_wins_bedwars || 0) / (bedWarsStats?.four_three_games_played_bedwars || 1),
        four_four: (bedWarsStats?.four_four_wins_bedwars || 0) / (bedWarsStats?.four_four_games_played_bedwars || 1),
        two_four: (bedWarsStats?.two_four_wins_bedwars || 0) / (bedWarsStats?.two_four_games_played_bedwars || 1),
      },

      finalKills: {
        overAll: bedWarsStats?.final_kills_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_final_kills_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_final_kills_bedwars || 0,
        four_three: bedWarsStats?.four_three_final_kills_bedwars || 0,
        four_four: bedWarsStats?.four_four_final_kills_bedwars || 0,
        two_four: bedWarsStats?.two_four_final_kills_bedwars || 0,
      },
      finalDeaths: {
        overAll: bedWarsStats?.final_deaths_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_final_deaths_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_final_deaths_bedwars || 0,
        four_three: bedWarsStats?.four_three_final_deaths_bedwars || 0,
        four_four: bedWarsStats?.four_four_final_deaths_bedwars || 0,
        two_four: bedWarsStats?.two_four_final_deaths_bedwars || 0,
      },
      finalKillDeathRatio: {
        overAll: (bedWarsStats?.final_kills_bedwars || 0) / (bedWarsStats?.final_deaths_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_final_kills_bedwars || 0) / (bedWarsStats?.eight_one_final_deaths_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_final_kills_bedwars || 0) / (bedWarsStats?.eight_two_final_deaths_bedwars || 0),
        four_three: (bedWarsStats?.four_three_final_kills_bedwars || 0) / (bedWarsStats?.four_three_final_deaths_bedwars || 0),
        four_four: (bedWarsStats?.four_four_final_kills_bedwars || 0) / (bedWarsStats?.four_four_final_deaths_bedwars || 0),
        two_four: (bedWarsStats?.two_four_final_kills_bedwars || 0) / (bedWarsStats?.two_four_final_deaths_bedwars || 0),
      },

      wins: {
        overAll: bedWarsStats?.wins_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_wins_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_wins_bedwars || 0,
        four_three: bedWarsStats?.four_three_wins_bedwars || 0,
        four_four: bedWarsStats?.four_four_wins_bedwars || 0,
        two_four: bedWarsStats?.two_four_wins_bedwars || 0,
      },
      losses: {
        overAll: bedWarsStats?.losses_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_losses_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_losses_bedwars || 0,
        four_three: bedWarsStats?.four_three_losses_bedwars || 0,
        four_four: bedWarsStats?.four_four_losses_bedwars || 0,
        two_four: bedWarsStats?.two_four_losses_bedwars || 0,
      },
      winLossRatio: {
        overAll: (bedWarsStats?.wins_bedwars || 0) / (bedWarsStats?.losses_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_wins_bedwars || 0) / (bedWarsStats?.eight_one_losses_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_wins_bedwars || 0) / (bedWarsStats?.eight_two_losses_bedwars || 0),
        four_three: (bedWarsStats?.four_three_wins_bedwars || 0) / (bedWarsStats?.four_three_losses_bedwars || 0),
        four_four: (bedWarsStats?.four_four_wins_bedwars || 0) / (bedWarsStats?.four_four_losses_bedwars || 0),
        two_four: (bedWarsStats?.two_four_wins_bedwars || 0) / (bedWarsStats?.two_four_losses_bedwars || 0),
      },

      kills: {
        overAll: bedWarsStats?.kills_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_kills_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_kills_bedwars || 0,
        four_three: bedWarsStats?.four_three_kills_bedwars || 0,
        four_four: bedWarsStats?.four_four_kills_bedwars || 0,
        two_four: bedWarsStats?.two_four_kills_bedwars || 0,
      },
      deaths: {
        overAll: bedWarsStats?.deaths_bedwars,
        eight_one: bedWarsStats?.eight_one_deaths_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_deaths_bedwars || 0,
        four_three: bedWarsStats?.four_three_deaths_bedwars || 0,
        four_four: bedWarsStats?.four_four_deaths_bedwars || 0,
        two_four: bedWarsStats?.two_four_deaths_bedwars || 0,
      },
      killDeathRatio: {
        overAll: (bedWarsStats?.kills_bedwars || 0) / (bedWarsStats?.deaths_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_kills_bedwars || 0) / (bedWarsStats?.eight_one_deaths_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_kills_bedwars || 0) / (bedWarsStats?.eight_two_deaths_bedwars || 0),
        four_three: (bedWarsStats?.four_three_kills_bedwars || 0) / (bedWarsStats?.four_three_deaths_bedwars || 0),
        four_four: (bedWarsStats?.four_four_kills_bedwars || 0) / (bedWarsStats?.four_four_deaths_bedwars || 0),
        two_four: (bedWarsStats?.two_four_kills_bedwars || 0) / (bedWarsStats?.two_four_deaths_bedwars || 0),
      },

      bedsBroken: {
        overAll: bedWarsStats?.beds_broken_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_beds_broken_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_beds_broken_bedwars || 0,
        four_three: bedWarsStats?.four_three_beds_broken_bedwars || 0,
        four_four: bedWarsStats?.four_four_beds_broken_bedwars || 0,
        two_four: bedWarsStats?.two_four_beds_broken_bedwars || 0,
      },
      bedsLost: {
        overAll: bedWarsStats?.beds_lost_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_beds_lost_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_beds_lost_bedwars || 0,
        four_three: bedWarsStats?.four_three_beds_lost_bedwars || 0,
        four_four: bedWarsStats?.four_four_beds_lost_bedwars || 0,
        two_four: bedWarsStats?.two_four_beds_lost_bedwars || 0,
      },
      bedBreakLossRatio: {
        overAll: (bedWarsStats?.beds_broken_bedwars || 0) / (bedWarsStats?.beds_lost_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_beds_broken_bedwars || 0) / (bedWarsStats?.eight_one_beds_lost_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_beds_broken_bedwars || 0) / (bedWarsStats?.eight_two_beds_lost_bedwars || 0),
        four_three: (bedWarsStats?.four_three_beds_broken_bedwars || 0) / (bedWarsStats?.four_three_beds_lost_bedwars || 0),
        four_four: (bedWarsStats?.four_four_beds_broken_bedwars || 0) / (bedWarsStats?.four_four_beds_lost_bedwars || 0),
        two_four: (bedWarsStats?.two_four_beds_broken_bedwars || 0) / (bedWarsStats?.two_four_beds_lost_bedwars || 0),
      },
    },
  };
}

const ranks: { [index: string]: any } = {
  'ADMIN': [
    ['c', '[ADMIN]'],
  ],
  'MODERATOR': [
    ['2', '[MOD]'],
  ],
  'HELPER': [
    ['9', '[HELPER]'],
  ],
  'JR_HELPER': [
    ['9', '[JR HELPER]'],
  ],
  'YOUTUBER': [
    ['c', '['],
    ['f', 'YOUTUBE'],
    ['c', ']'],
  ],
  'SUPERSTAR': [
    ['%r', '[MVP'],
    ['%p', '++'],
    ['%r', ']'],
  ],
  'MVP_PLUS': [
    ['b', '[MVP'],
    ['%p', '+'],
    ['b', ']'],
  ],
  'MVP': [
    ['b', '[MVP]'],
  ],
  'VIP_PLUS': [
    ['a', '[VIP'],
    ['6', '+'],
    ['a', ']'],
  ],
  'VIP': [
    ['a', '[VIP]'],
  ],
  'DEFAULT': [
    ['7', ''],
  ],
};

// Code up to line 570 is stolen from unborn-hypixel npm package
function getPlayerRank(playerStats: Player) {
  return (getString(calcTag(playerStats)) === '&7' ?
    getString(calcTag(playerStats)) :
    (getString(calcTag(playerStats)) + ' ')).replace(/&/g, '§');
}

const nameBasedColors: { [index: string]: string | undefined } = { // Convert name-based colors to number-based
  'BLACK': '0',
  'DARK_BLUE': '1',
  'DARK_GREEN': '2',
  'DARK_AQUA': '3',
  'DARK_RED': '4',
  'DARK_PURPLE': '5',
  'GOLD': '6',
  'GRAY': '7',
  'DARK_GRAY': '8',
  'BLUE': '9',
  'GREEN': 'a',
  'AQUA': 'b',
  'RED': 'c',
  'LIGHT_PURPLE': 'd',
  'YELLOW': 'e',
  'WHITE': 'f',
};

/**
 * Calculate the rank tag for the player object from the Hypixel API
 * @param player Player object from Hypixel API
 * @returns {*} Tag as an object like in {@link ranks}
 */
function calcTag(player: Player) {
  if (player && typeof player === 'object') {
    // In order of the least priority to the highest priority
    let packageRank: string | undefined | null = player.packageRank;
    let newPackageRank: string | undefined | null = player.newPackageRank;
    let monthlyPackageRank: string | undefined | null = player.monthlyPackageRank;
    const rankPlusColor = player.rankPlusColor;
    const monthlyRankColor = player.monthlyRankColor;
    let rank: string | undefined | null = player.rank;
    const prefix = player.prefix;

    if (rank === 'NORMAL')
      rank = null;
    if (monthlyPackageRank === 'NONE')
      monthlyPackageRank = null;
    if (packageRank === 'NONE')
      packageRank = null;
    if (newPackageRank === 'NONE')
      newPackageRank = null;

    if (prefix)
      return parseMinecraftTag(prefix);
    if (rank || monthlyPackageRank || newPackageRank || packageRank)
      return replaceCustomColors(
        ranks[rank || monthlyPackageRank || newPackageRank || packageRank || 'DEFAULT'],
        nameBasedColors[rankPlusColor || 'GRAY'],
        nameBasedColors[monthlyRankColor || 'GRAY']);
  }
  return replaceCustomColors(ranks.DEFAULT);
}

function getString(rank: string[][]): string {
  let rankString = '';
  rank.forEach((arr: string[]) => {
    rankString += '&' + arr[0] + arr[1];
  });
  return rankString;
}

/**
 * Parse a tag that is in Minecraft form using formatting codes
 * @param tag Tag to parse
 * @return {*} Tag that is an object like in {@link ranks}
 */
function parseMinecraftTag(tag: string) {
  if (tag) {
    const newRank: string[][] | never[][][] = [];

    // Even indexes should be formatting codes, odd indexes should be text
    const splitTag = tag.split(/§([a-f\d])/);
    splitTag.unshift('f'); // Beginning is always going to be white (typically empty though)

    for (let i = 0; i < splitTag.length; i++) {
      const j = Math.floor(i / 2); // First index
      const n = i % 2; // Second index

      if (!newRank[j])
        newRank[j] = [];
      if (!newRank[j][n])
        newRank[j][n] = [];
      newRank[j][n] = splitTag[i];
    }

    return newRank;
  } else {
    return [['f', '']];
  }
}

const defaultPlusColor = 'c'; // %p
const defaultRankColor = '6'; // %r

/**
 * Replace the custom colors wildcards (%r and %p) with their actual colors in ranks
 * @param rank Rank in the structure found in {@link ranks}
 * @param p Plus color
 * @param r Rank color
 * @returns {*} New rank with real colors
 */
function replaceCustomColors(
  rank: string | string[],
  p?: string | string[],
  r?: string | string[],
) {
  if (!(rank instanceof Array))
    return rank;

  // Deep copy the rank
  const newRank = JSON.parse(JSON.stringify(rank));

  // Set defaults
  if (!p || typeof p !== 'string' || p.length > 1)
    p = defaultPlusColor;
  if (!r || typeof r !== 'string' || r.length > 1)
    r = defaultRankColor;

  // Go through rank and replace wildcards
  newRank.forEach((component: string | any[]) => {
    if (component instanceof Array && component.length >= 2) {
      if (component[0] === '%p')
        component[0] = p;
      else if (component[0] === '%r')
        component[0] = r;
    }
  });

  return newRank;
}
