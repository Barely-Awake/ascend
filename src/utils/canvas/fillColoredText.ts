import { CanvasRenderingContext2D } from 'canvas';
import { colors } from '../minecraft/getFormattedLevel.js';
import removeColorCodes from './removeColorCodes.js';

export default function (text: string, ctx: CanvasRenderingContext2D, textPosX: number, textPosY: number, textAlign = 'center'): void {
  const levelArray = ('§r' + text).split(/§/g);

  const startingTextAlign = ctx.textAlign;
  const startingFont = ctx.font;
  const startingFillStyle = ctx.fillStyle;

  ctx.textAlign = 'left';
  if (textAlign === 'center') {
    const textWidth = ctx.measureText(removeColorCodes(text)).width;
    textPosX = textPosX - textWidth / 2;
  }

  let textCompleted = ''; // The text that has been filled so far
  for (let i = 0; i < levelArray.length; i++) {
    let currentColor = levelArray[i].charAt(0).toLocaleLowerCase();
    levelArray[i] = levelArray[i].substring(1);

    const fillStyle = colors[currentColor];
    let boldCompensate = false;

    switch (fillStyle) {
      case 'hex':
        ctx.fillStyle = '#' + levelArray[i].substring(0, 6);
        levelArray[i] = levelArray[i].slice(6);
        break;
      case 'bold':
        boldCompensate = true;
        if (!ctx.font.includes('Italic')) {
          ctx.font = `${startingFont} Bold`;
        } else {
          ctx.font = `${startingFont} Bold Italic`;
        }
        break;
      case 'italic':
        if (!ctx.font.includes('Bold')) {
          ctx.font = `${startingFont} Italic`;
        } else {
          boldCompensate = true;
          ctx.font = `${startingFont} Bold Italic`;
        }
        break;
      case 'reset':
        boldCompensate = false;
        ctx.font = startingFont;
        ctx.fillStyle = startingFillStyle;
        break;
      default:
        ctx.fillStyle = fillStyle;
        break;
    }

    ctx.fillText(
      levelArray[i],
      textPosX + ctx.measureText(textCompleted).width -
      (boldCompensate && !startingFont.toLocaleLowerCase().includes('bold') ? textCompleted.length : 0),
      textPosY,
    );

    textCompleted += levelArray[i];
  }

  ctx.textAlign = startingTextAlign;
  ctx.font = startingFont;
  ctx.fillStyle = startingFillStyle;
}