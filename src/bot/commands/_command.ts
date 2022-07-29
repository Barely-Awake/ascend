// Template command
import { Message } from 'discord.js';

export default function (message: Message, args: string[]) {
  return;
}

export const commandInfo: CommandInfo = {
  name: '_example',
  category: 'info',
  description: 'Example command',
  usage: '<Required Argument> [Optional Argument]',
};

export interface CommandInfo {
  name: string;
  category: 'config' | 'info' | 'moderation' | 'minecraft' | 'externalApis' | 'misc';
  aliases?: string[];
  description: string;
  usage: string;
}