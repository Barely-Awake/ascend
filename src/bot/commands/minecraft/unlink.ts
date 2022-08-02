import { Message } from 'discord.js';
import Player from '../../../mongo/player.js';
import { CommandCategory } from '../../../types/discord.js';
import { error } from '../../../utils/discord/responses.js';

export default class Unlink {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'unlink',
    category: CommandCategory = 'minecraft',
    aliases: string[] | null = null,
    description = 'Unlinks your discord account from your minecraft account',
    usage = '',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, _: string[]) {
    const linkedAccountData = await Player.find({discordId: message.author.id});

    if (linkedAccountData.length === 0)
      return error('You haven\'t linked an account yet!', message);
    const names: string[] = [];

    linkedAccountData.forEach((v) => {
      if (v.playerName !== undefined)
        names.push(v.playerName);
    });
    await Player.deleteMany({discordId: message.author.id});

    return message.channel.send(`Successfully unlinked your discord account from \`${names.join(' & ') || 'Unknown'}\``);
  }
}
