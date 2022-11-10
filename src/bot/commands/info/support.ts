import { CommandCategory } from '../../botData.js';
import { Message } from 'discord.js';

export default class Support {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'support',
    category: CommandCategory = 'info',
    aliases: string[] | null = null,
    description = 'Provides the support discord invite link',
    usage = ''
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  command(message: Message, _: string[]) {
    message.channel.send('For support please join discord.gg/PpdbKXKgT3');
  }
}
