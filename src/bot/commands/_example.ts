import { Message } from 'discord.js';

export default function (message: Message, args: string[]) {
  return;
}

export const description: DescriptionTypes = {
  name: '_example',
  description: 'Example command',
  usage: '<Required Argument> [Optional Argument]',
};

export interface DescriptionTypes {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
}