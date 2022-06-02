import { CanvasRenderingContext2D } from 'canvas';
import { colors } from '../minecraft/getFormattedLevel.js';

export default function (stringWithColorCodes: string, ctx: CanvasRenderingContext2D, textPosX: number, textPosY: number, textAlign = 'center'): void {
  const levelArray = ('§r' + stringWithColorCodes).split(/§/g);
  let textContent = '';
  const orderedColors: (string | number)[] = [];

  levelArray.forEach(value => {
    orderedColors.push(value.charAt(0).toLocaleLowerCase());
    value = value.substring(1);
    textContent += value;
  })

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

  levelArray.forEach((value, index) => {
    const fillStyle = colors[orderedColors[index]];
    let boldCompensate = false;

    switch (fillStyle) {
      case 'hex':
        ctx.fillStyle = '#' + value.substring(0, 6);
        value = value.slice(6);
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

    ctx.fillText(value,
      trueTextPosX + ctx.measureText(textContent).width - (boldCompensate ?
        textContent.length : 0), textPosY);

    textContent += value;
  })

  ctx.font = startingFont;
  ctx.fillStyle = startingFillStyle;
}