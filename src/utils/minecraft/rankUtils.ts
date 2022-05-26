import { Player } from '../../types/hypixelResponseTypes.js';

const ranks: { [index: string]: any } = {
  'ADMIN': [
    [
      'c',
      '[ADMIN]',
    ],
  ],
  'MODERATOR': [
    [
      '2',
      '[MOD]',
    ],
  ],
  'HELPER': [
    [
      '9',
      '[HELPER]',
    ],
  ],
  'JR_HELPER': [
    [
      '9',
      '[JR HELPER]',
    ],
  ],
  'YOUTUBER': [
    [
      'c',
      '[',
    ],
    [
      'f',
      'YOUTUBE',
    ],
    [
      'c',
      ']',
    ],
  ],
  'SUPERSTAR': [
    [
      '%r',
      '[MVP',
    ],
    [
      '%p',
      '++',
    ],
    [
      '%r',
      ']',
    ],
  ],
  'MVP_PLUS': [
    [
      'b',
      '[MVP',
    ],
    [
      '%p',
      '+',
    ],
    [
      'b',
      ']',
    ],
  ],
  'MVP': [
    [
      'b',
      '[MVP]',
    ],
  ],
  'VIP_PLUS': [
    [
      'a',
      '[VIP',
    ],
    [
      '6',
      '+',
    ],
    [
      'a',
      ']',
    ],
  ],
  'VIP': [
    [
      'a',
      '[VIP]',
    ],
  ],
  'DEFAULT': [
    [
      '7',
      '',
    ],
  ],
};

const colors: { [index: string]: string | undefined } = { // Convert name-based colors to number-based
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
    let rankPlusColor = player.rankPlusColor;
    let monthlyRankColor = player.monthlyRankColor;
    let rank: string | undefined | null = player.rank;
    let prefix = player.prefix;

    if (rank === 'NORMAL')
      rank = null; // Don't care about normies
    if (monthlyPackageRank === 'NONE')
      monthlyPackageRank = null; // Don't care about cheapos
    if (packageRank === 'NONE')
      packageRank = null;
    if (newPackageRank === 'NONE')
      newPackageRank = null;

    if (prefix)
      return parseMinecraftTag(prefix);
    if (rank || monthlyPackageRank || newPackageRank || packageRank)
      return replaceCustomColors(
        ranks[rank || monthlyPackageRank || newPackageRank || packageRank || 'DEFAULT'],
        colors[rankPlusColor || 'GRAY'],
        colors[monthlyRankColor || 'GRAY']);
  }
  return replaceCustomColors(ranks.DEFAULT, null, null);
}

function getString(rank: string[][]) {
  let rankString = '';
  rank.forEach((arr: string[]) => {
    rankString = rankString + '&' + arr[0] + arr[1];
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
    let newRank: any[] = [];

    // Even indexes should be formatting codes, odd indexes should be text
    let splitTag = tag.split(/§([a-f\d])/);
    splitTag.unshift('f'); // Beginning is always going to be white (typically empty though)

    for (let i = 0; i < splitTag.length; i++) {
      let j = Math.floor(i / 2); // First index
      let k = i % 2; // Second index

      if (!newRank[j])
        newRank[j] = [];
      if (!newRank[j][k])
        newRank[j][k] = [];
      newRank[j][k] = splitTag[i];
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
function replaceCustomColors(rank: any, p: string | any[] | null | undefined, r: string | any[] | null | undefined) {
  if (!(rank instanceof Array))
    return rank;

  // Deep copy the rank
  let newRank = JSON.parse(JSON.stringify(rank));

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
      if (component[0] === '%r')
        component[0] = r;
    }
  });

  return newRank;
}

export default {
  replaceCustomColors,
  parseMinecraftTag,
  calcTag,
  getString,
  colors,
};