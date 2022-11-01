// Without this file, assigning client.commands to anything would make typescript throw an error
import { CommandCategory, CommandCollection } from '../bot/botData.js';
import { Message } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: CommandCollection;
    cache: Cache;
  }
}

interface Cache {
  prefixes: {
    [serverId: string]: string;
  };
}

export interface CommandClass {
  name: string;
  category: CommandCategory;
  aliases: string[] | null;
  description: string;
  usage: string;
  command: CommandFunction;
}

export type CommandFunction = (message: Message, args: string[]) => unknown;
