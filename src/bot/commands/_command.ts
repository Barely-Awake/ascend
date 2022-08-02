// Template command
import { Message } from 'discord.js';
import { CommandCategory, CommandClass } from '../../types/discord.js';

export default class _Example implements CommandClass {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = '_example',
    category: CommandCategory = 'info',
    aliases: string[] | null = ['example_'], // Set to null for no aliases
    description = 'Example command',
    usage = '<Required Argument> [Optional Argument]',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  command(message: Message, args: string[]) {
    return;
  }
}
