import { Collection, Message } from 'discord.js';

// Without this file, assigning client.commands to anything would make typescript throw an error
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, (message: Message, args: string[]) => void | Promise<void>>;
  }
}