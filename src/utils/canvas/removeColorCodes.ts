import { colors } from '../minecraft/getFormattedLevel.js';

export default function (text: string): string {
  const levelArray = ('§r' + text).split(/§/g);
  let cleanedText = '';
  for (let i = 0; i < levelArray.length; i++) {
    let currentColor = colors[levelArray[i].charAt(0).toLocaleLowerCase()];
    levelArray[i] = levelArray[i].substring(1);

    if (currentColor === 'hex')
      cleanedText += levelArray[i].slice(0, 6);
    else
      cleanedText += levelArray[i].slice();
  }

  return cleanedText;
}