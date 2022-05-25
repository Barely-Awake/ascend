// Colors and getFormattedLevel were stolen from Statsify Overlay (Though they've been modified)

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