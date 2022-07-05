import { Message } from 'discord.js';

export default function (message: Message, args: string[]) {
  return;
}

export const description: DescriptionTypes = {
  name: '_example',
  category: 'info',
  description: 'Example command',
  usage: '<Required Argument> [Optional Argument]',
};

export interface DescriptionTypes {
  name: string;
  category: 'config' | 'info' | 'moderation' | 'minecraft' | 'externalProfiles' | 'misc';
  aliases?: string[];
  description: string;
  usage: string;
}