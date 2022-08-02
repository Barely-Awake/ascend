import { Collection, Message } from 'discord.js';

// Without this file, assigning client.commands to anything would make typescript throw an error
declare module 'discord.js' {
  export interface Client {
    commands: CommandCollection;
    cache: Cache;
  }
}

export interface CommandClass {
  name: string;
  category: CommandCategory;
  aliases: string[] | null;
  description: string;
  usage: string;
  command: CommandFunction;
}

export type CommandFunction = (message: Message, args: string[]) => any;
export type CommandCollection = Collection<string, CommandClass>;
export type CommandCategory = 'config' | 'info' | 'moderation' | 'minecraft' | 'externalApis' | 'misc';

interface Cache {
  prefixes: {
    [serverId: string]: string
  };
}
