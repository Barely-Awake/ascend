import * as Discord from 'discord.js';
import { DescriptionTypes } from './_example.js';
import getPlayerUuid from '../../utils/minecraft/getPlayerUuid.js';
import getPlayerStats from '../../utils/minecraft/getPlayerStats.js';
import drawRoundedRectangle from '../../utils/canvas/drawRoundedRectangle.js';
import calculateBedWarsLevel from '../../utils/minecraft/calculateBedWarsLevel.js';
import { getFormattedLevel } from '../../utils/minecraft/getFormattedLevel.js';
import formatPlayerStats from '../../utils/minecraft/formatPlayerStats.js';
import fillColoredText from '../../utils/canvas/fillColoredText.js';
import pkg, { Canvas, CanvasRenderingContext2D } from 'canvas';
import playerStatsTypes from '../../types/playerStatsTypes.js';

const {createCanvas} = pkg;

export default async function (message: Discord.Message, args: string[]) {
  let player = args[0];

  if (!args[0])
    return message.channel.send('Please provide a player.');

  if (player.length !== 32 && player.length !== 36)
    player = await getPlayerUuid(player);

  if (!player)
    return message.channel.send('Player not found.');

  const hypixelApiResponse = await getPlayerStats(player);

  if (hypixelApiResponse === false || hypixelApiResponse === undefined)
    return message.channel.send('Hypixel API error or Invalid player.');

  const playerStats = formatPlayerStats(hypixelApiResponse);

  const firstFile = drawFirstCanvas(playerStats);
  const secondFile = drawSecondCanvas(playerStats);

  message.channel.send({
    files: [
      {attachment: firstFile, name: `${playerStats.displayName}-top.png`},
      {attachment: secondFile, name: `${playerStats.displayName}-bottom.png`},
    ],
  });
}

function drawFirstCanvas(playerStats: playerStatsTypes) {
  const canvas = createCanvas(870, 680);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#202225';

  // Draw the general background
  drawRoundedRectangle(ctx, 0, 0, canvas.width, canvas.height, {tl: 40, tr: 40, br: 0, bl: 0}, true, false);

  ctx.fillStyle = '#ffffff';
  ctx.font = '40px Minecraft';
  ctx.textAlign = 'center';

  // Draw the user's display name
  let playerBedWarsLevel = getFormattedLevel(calculateBedWarsLevel(playerStats.bedWars.experience));
  fillColoredText(`${playerBedWarsLevel} §r${playerStats.rank}${playerStats.displayName}`, ctx, canvas.width / 2, 60);

  ctx.fillStyle = '#36393f';

  // Draw the stats' background
  drawRoundedRectangle(ctx,
    20,
    80,
    canvas.width - 40,
    canvas.height,
    {tl: 40, tr: 40, br: 0, bl: 0},
    true,
    false,
  );

  const includedOrderedModes = ['Overall', 'Solo', 'Doubles'];

  const textPositions = drawModes(
    ctx,
    canvas,
    includedOrderedModes,
    [100, canvas.height - 10],
    125,
  );

  ctx.fillStyle = '#999999';
  ctx.font = '26px Sonus';

  for (let i in includedOrderedModes) {
    let mode: string;
    switch (includedOrderedModes[i]) {
      case 'Overall':
        mode = 'overAll';
        break;
      case 'Solo':
        mode = 'eight_one';
        break;
      case 'Doubles':
        mode = 'eight_two';
        break;
      default:
        mode = 'overAll';
    }
    fillModeStats(mode, playerStats, Number(i), ctx, textPositions, 125);
  }

  return canvas.toBuffer();
}

function drawSecondCanvas(playerStats: playerStatsTypes) {
  const canvas = createCanvas(870, 680);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#202225';

  // Draw the general background
  drawRoundedRectangle(ctx,
    0,
    0,
    canvas.width,
    canvas.height - 40,
    {tl: 0, tr: 0, br: 40, bl: 40},
    true,
    false);

  ctx.fillStyle = '#36393f';

  // Draw the stats' background
  drawRoundedRectangle(ctx,
    20,
    0,
    canvas.width - 40,
    canvas.height - 60,
    {tl: 0, tr: 0, br: 40, bl: 40},
    true,
    false,
  );

  const includedOrderedModes = ['Threes', 'Fours', '4v4'];

  const textPositions = drawModes(
    ctx,
    canvas,
    includedOrderedModes,
    [20, canvas.height - 85],
    45,
  );

  ctx.fillStyle = '#999999';
  ctx.font = '26px Sonus';

  for (let i in includedOrderedModes) {
    let mode: string;
    switch (includedOrderedModes[i]) {
      case 'Threes':
        mode = 'four_three';
        break;
      case 'Fours':
        mode = 'four_four';
        break;
      case '4v4':
        mode = 'two_four';
        break;
      default:
        mode = 'four_three';
    }
    fillModeStats(mode, playerStats, Number(i), ctx, textPositions, 50);
  }

  return canvas.toBuffer();
}

const statsText =
  `Winstreak: §#F8A619§l$winStreak
Win Rate: §#F8A619§l$winRate%

Wins: §#41B07C§l$wins
Losses: §#EA4645§l$losses
WLR: §#F8A619§l$wlr

Final Kills: §#41B07C§l$finalKills
Final Deaths: §#EA4645§l$finalDeaths
FKDR: §#F8A619§l$fkdr

Kills: §#41B07C§l$kills
Deaths: §#EA4645§l$deaths
KDR: §#F8A619§l$kdr

Beds Broken: §#41B07C§l$bedsBroken
Beds Lost: §#EA4645§l$bedsLost
BBLR: §#F8A619§l$bblr§r`;

function drawModes(ctx: CanvasRenderingContext2D, canvas: Canvas, modes: string[], lineInfo: number[], textYPos: number) {
  ctx.strokeStyle = '#40444b';
  ctx.lineWidth = 3;

  // Draw separating line at 1/3 of the width of the canvas
  ctx.beginPath();
  ctx.moveTo(canvas.width / 3, lineInfo[0]);
  ctx.lineTo(canvas.width / 3, lineInfo[1]);
  ctx.stroke();

  // Do the same at 2/3 of the width of the canvas
  ctx.beginPath();
  ctx.moveTo(canvas.width / 3 * 2, lineInfo[0]);
  ctx.lineTo(canvas.width / 3 * 2, lineInfo[1]);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Sonus Bold';
  ctx.textAlign = 'left';

  // The stats' rectangle is 20px away from the border, so we need to offset the "Overall" text by 40px
  const textPositions = [40, canvas.width / 3 + 20, canvas.width / 3 * 2 + 20];

  ctx.fillText(modes[0], textPositions[0], textYPos);
  ctx.fillText(modes[1], textPositions[1], textYPos);
  ctx.fillText(modes[2], textPositions[2], textYPos);

  return textPositions;
}

function fillModeStats(
  mode: string,
  playerStats: playerStatsTypes,
  i: number,
  ctx: CanvasRenderingContext2D,
  textPositions: number[],
  initialYPos: number,
) {
  let textToFill = statsText
    .replace('$winStreak',
      playerStats.bedWars.winStreak[mode] !== null ?
        (playerStats.bedWars.winStreak[mode] || 0).toLocaleString() :
        '?')
    .replace('$winRate',
      ((playerStats.bedWars.winRate[mode] || 0) * 100)
        .toLocaleString('en-US', {maximumFractionDigits: 2}))

    .replace('$wins', (playerStats.bedWars.wins[mode] || 0).toLocaleString())
    .replace('$losses', (playerStats.bedWars.losses[mode] || 0).toLocaleString())
    .replace('$wlr', (playerStats.bedWars.winLossRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}))

    .replace('$finalKills', (playerStats.bedWars.finalKills[mode] || 0).toLocaleString())
    .replace('$finalDeaths', (playerStats.bedWars.finalDeaths[mode] || 0).toLocaleString())
    .replace('$fkdr', (playerStats.bedWars.finalKillDeathRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}))

    .replace('$kills', (playerStats.bedWars.kills[mode] || 0).toLocaleString())
    .replace('$deaths', (playerStats.bedWars.deaths[mode] || 0).toLocaleString())
    .replace('$kdr', (playerStats.bedWars.killDeathRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}))

    .replace('$bedsBroken', (playerStats.bedWars.bedsBroken[mode] || 0).toLocaleString())
    .replace('$bedsLost', (playerStats.bedWars.bedsLost[mode] || 0).toLocaleString())
    .replace('$bblr', (playerStats.bedWars.bedBreakLossRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}));

  textToFill.split('\n').forEach((line, index) => {
    fillColoredText(line, ctx, textPositions[i], initialYPos + (index + 1) * 30, 'left');
  });
}

export const description: DescriptionTypes = {
  name: 'bedwars',
  aliases: ['bw'],
  description: 'Shows a player\'s bedwars stats',
  usage: '[player]',
};