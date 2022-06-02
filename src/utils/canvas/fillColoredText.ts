import { CanvasRenderingContext2D } from 'canvas';
import { colors } from '../minecraft/getFormattedLevel.js';

export default function (stringWithColorCodes: string, ctx: CanvasRenderingContext2D, textPosX: number, textPosY: number, textAlign = 'center'): void  {
  let levelArray = ('§r' + stringWithColorCodes).split(/§/g);
  let textContent = '';
  let orderedColors = [];

  for (let i in levelArray) {
    orderedColors.push(levelArray[i].charAt(0).toLocaleLowerCase());
    levelArray[i] = levelArray[i].substring(1);
    textContent += levelArray[i];
  }

  let textWidth = ctx.measureText(textContent).width;
  textContent = '';
  let trueTextPosX;
  if (textAlign === 'center')
    trueTextPosX = textPosX - textWidth / 2;
  else
    trueTextPosX = textPosX;
  ctx.textAlign = 'left';

  const startingFont = ctx.font;
  const startingFillStyle = ctx.fillStyle;

  for (let i in levelArray) {
    const fillStyle = colors[orderedColors[i]];
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

    ctx.fillText(levelArray[i],
      trueTextPosX + ctx.measureText(textContent).width - (boldCompensate ?
        textContent.length : 0), textPosY);

    textContent += levelArray[i];
  }

  ctx.font = startingFont;
  ctx.fillStyle = startingFillStyle;
}