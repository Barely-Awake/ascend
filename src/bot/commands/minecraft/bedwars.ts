import canvasPkg, { Canvas, CanvasRenderingContext2D } from 'canvas';
import { Message } from 'discord.js';
import playerStatsTypes from '../../../types/playerStatsTypes.js';
import convertMode from '../../../utils/canvas/convertMode.js';
import drawRoundedRectangle from '../../../utils/canvas/drawRoundedRectangle.js';
import fillColoredText from '../../../utils/canvas/fillColoredText.js';
import { resolvePlayer } from '../../../utils/discord/resolveTarget.js';
import { error } from '../../../utils/discord/responses.js';
import { calculateBedWarsLevel, getFormattedLevel, getPlayerStats } from '../../../utils/minecraft/hypixelApi.js';
import { CommandInfo } from '../_command.js';

const {createCanvas, loadImage} = canvasPkg;

let winStreakApiOn: boolean;

export default async function (message: Message, args: string[]) {
  message.channel.sendTyping();
  const mojangData = await resolvePlayer((args[0] || '').toLowerCase(), message);

  if (typeof mojangData === 'string')
    return error(mojangData, message);

  const player = mojangData.uuid;

  const playerStats = await getPlayerStats(player);

  if (playerStats === null)
    return message.reply('Couldn\'t get player stats from Hypixel\'s API');

  const canvas = await drawBedWarsCanvas(playerStats);

  await message.reply({
    files: [
      {attachment: canvas, name: `${playerStats.displayName}-top (i'm a top :weary:).png`},
    ],
  });
}

export async function drawBedWarsCanvas(playerStats: playerStatsTypes) {
  const canvas = createCanvas(870, 675);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#363636';
  // Draw the general background
  drawRoundedRectangle(
    ctx,
    0,
    0,
    canvas.width,
    canvas.height,
    {tr: 40, tl: 40, br: 40, bl: 40},
    true,
    false,
  );

  ctx.fillStyle = 'rgba(0,0,0,0.4)';

  // Draw the players information
  await drawPlayerProfile(ctx, canvas, playerStats);

  ctx.fillStyle = 'rgba(0,0,0,0.4)';

  // Draw the stats' background
  drawRoundedRectangle(ctx,
    20,
    120,
    canvas.width - 40,
    canvas.height - 135,
    40,
    true,
    false,
  );

  const firstIncludedOrderedModes: ['Overall', 'Solo', 'Doubles'] = ['Overall', 'Solo', 'Doubles'];

  const firstTextPositions = drawModes(
    ctx,
    canvas,
    firstIncludedOrderedModes,
    [130, canvas.height - 25],
    150,
  );

  ctx.fillStyle = '#999999';
  ctx.font = '30px Sonus';

  firstIncludedOrderedModes.forEach((value, index) => {
    const mode = convertMode(value);
    fillModeStats(mode, playerStats, Number(index), ctx, firstTextPositions, 150);
  });

  const secondIncludedOrderedModes: ['Threes', 'Fours', '4v4'] = ['Threes', 'Fours', '4v4'];

  const secondTextPositions = drawModes(
    ctx,
    canvas,
    secondIncludedOrderedModes,
    [130, canvas.height - 25],
    410,
  );

  ctx.fillStyle = '#999999';
  ctx.font = '30px Sonus';

  secondIncludedOrderedModes.forEach((value, index) => {
    const mode = convertMode(value);
    fillModeStats(mode, playerStats, Number(index), ctx, secondTextPositions, 410);
  });

  return canvas.toBuffer();
}

const statsText = `Winstreak: §$winStreakColor§l$winStreakLabel$winStreak

WLR: §#F8A619§l$wlr
Wins: §#41B07C§l$wins
Losses: §#EA4645§l$losses

FKDR: §#F8A619§l$fkdr
FKs: §#41B07C§l$finalKills
FDs: §#EA4645§l$finalDeaths§r`;

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
  const textToFill = statsText
    .replace('$winStreakColor', winStreakApiOn ? '#F8A619' : '#EA4645')
    .replace('$winStreakLabel', winStreakApiOn ? '' : '~')
    .replace('$winStreak', (playerStats.bedWars.winStreak[mode] || 0).toLocaleString())

    .replace('$wlr', (playerStats.bedWars.winLossRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}))
    .replace('$wins', (playerStats.bedWars.wins[mode] || 0).toLocaleString())
    .replace('$losses', (playerStats.bedWars.losses[mode] || 0).toLocaleString())

    .replace('$fkdr', (playerStats.bedWars.finalKillDeathRatio[mode] || 0)
      .toLocaleString('en-US', {maximumFractionDigits: 2}))
    .replace('$finalKills', (playerStats.bedWars.finalKills[mode] || 0).toLocaleString())
    .replace('$finalDeaths', (playerStats.bedWars.finalDeaths[mode] || 0).toLocaleString());

  textToFill.split('\n').forEach((line, index) => {
    fillColoredText(
      line,
      ctx,
      textPositions[i],
      initialYPos + (index + 1) * 30 - (index > 1 ? 20 : 0) - (index > 5 ? 20 : 0),
      'left',
    );
  });
}

async function drawPlayerProfile(ctx: CanvasRenderingContext2D, canvas: Canvas, playerStats: playerStatsTypes) {
  // Draw the player's background
  drawRoundedRectangle(ctx,
    20,
    15,
    canvas.width - 40,
    90,
    30,
    true,
    false,
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = `${playerStats.nick ? 30 : 40}px Minecraft`;
  ctx.textAlign = 'center';

  // Draw the user's display name
  const bedWarsLevel = calculateBedWarsLevel(playerStats.bedWars.experience);
  const displayBedWarsLevel = getFormattedLevel(bedWarsLevel);
  const displayName = `${displayBedWarsLevel} §r${playerStats.rank}${playerStats.displayName}`.replace(/&/g, '§');
  fillColoredText(displayName, ctx, 480, playerStats.nick ? 55 : 75);

  if (playerStats.nick) {
    fillColoredText(`§#999999Nick - §#EA4645${playerStats.nick}`, ctx, 480, 85);
  }

  const playerHead = await loadImage(`https://crafatar.com/avatars/${playerStats.uuid}?overlay&size=80`);

  ctx.save();
  // Setting opacity to 0 so no outer edges of base rectangle are visible
  ctx.fillStyle = 'rgba(0,0,0,0)';
  drawRoundedRectangle(ctx, 25, 20, 80, 80, 30, true, false);
  // Fits the player head that is about to be drawn to the previously drawn rectangle
  ctx.clip();
  ctx.drawImage(playerHead, 25, 20, 80, 80);
  ctx.restore();
}

export const commandInfo: CommandInfo = {
  name: 'bedwars',
  category: 'minecraft',
  aliases: ['bw'],
  description: 'Shows a player\'s bedwars stats',
  usage: '[player]',
};