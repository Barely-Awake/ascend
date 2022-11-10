import config from '../../../utils/misc/readConfig.js';
import { CommandCategory } from '../../botData.js';
import { EmbedBuilder, Message } from 'discord.js';

export default class Invite {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'invite',
    category: CommandCategory = 'info',
    aliases: string[] | null = ['botinvite'],
    description = 'Provides an invite link for this bot',
    usage = ''
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  command(message: Message, _: string[]) {
    const embed = new EmbedBuilder()
      .setTitle(`Invite for \`${config.botName}\``)
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${message.client.user?.id}&permissions=8&scope=bot%20applications.commands`
      );

    message.channel.send({ embeds: [embed] });
  }
}
