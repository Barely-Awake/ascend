import { Message } from 'discord.js';

export default function (message: Message, args: string[]) {
  return;
}

export const description: DescriptionTypes = {
  name: '_example',
  category: 'general',
  description: 'Example command',
  usage: '<Required Argument> [Optional Argument]',
};

export interface DescriptionTypes {
  name: string;
  category: 'server' | 'moderation' | 'misc' | 'minecraft' | 'externalProfiles' | 'info' | 'general';
  aliases?: string[];
  description: string;
  usage: string;
}