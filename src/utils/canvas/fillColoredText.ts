import { CanvasRenderingContext2D } from 'canvas';
import { colors } from '../minecraft/getFormattedLevel.js';

export default function (stringWithColorCodes: string, ctx: CanvasRenderingContext2D, textPosX: number, textPosY: number, textAlign = 'center'): void {
  const levelArray = ('§r' + stringWithColorCodes).split(/§/g);
  let textContent = '';
  const orderedColors: (string | number)[] = [];

  for (let i = 0; i < levelArray.length; i++) {
    orderedColors.push(levelArray[i].charAt(0).toLocaleLowerCase());
    levelArray[i] = levelArray[i].substring(1);
    textContent += levelArray[i];
  }

  const textWidth = ctx.measureText(textContent).width;
  textContent = '';
  let trueTextPosX: number;
  if (textAlign === 'center')
    trueTextPosX = textPosX - textWidth / 2;
  else
    trueTextPosX = textPosX;
  ctx.textAlign = 'left';

  const startingFont = ctx.font;
  const startingFillStyle = ctx.fillStyle;

  for (let i = 0; i < levelArray.length; i++) {
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