import { Collection, Message } from 'discord.js';
import { CommandInfo } from '../bot/commands/_command.js';

// Without this file, assigning client.commands to anything would make typescript throw an error
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, CommandFunction>;
    cache: Cache;
  }
}

export type CommandFunction = (message: Message, args: string[]) => void | Promise<void>

interface Cache {
  commandInfo: {
    [command: string]: CommandInfo
  };
  prefixes: {
    [serverId: string]: string
  };
}