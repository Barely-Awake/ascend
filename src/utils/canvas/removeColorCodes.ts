import { colors } from '../minecraft/hypixelApi.js';

export default function (text: string): string {
  const textArray = `§r${text}`.split(/§/g);
  let cleanedText = '';
  for (let i = 0; i < textArray.length; i++) {
    const currentColor = colors[textArray[i].charAt(0).toLocaleLowerCase()];
    textArray[i] = textArray[i].substring(1);

    if (currentColor === 'hex') {
      cleanedText += textArray[i].slice(6);
    } else {
      cleanedText += textArray[i].slice();
    }
  }

  return cleanedText;
}
