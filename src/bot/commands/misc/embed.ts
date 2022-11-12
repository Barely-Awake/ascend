import { EmbedBuilder, Message } from 'discord.js';
import { CommandCategory } from '../../botData.js';
import { error } from '../../../utils/discord/responses.js';
import { requireArgs } from '../../../utils/discord/commandDecorators.js';

export default class Embed {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'embed',
    category: CommandCategory = 'misc',
    aliases: string[] | null = null,
    description = 'Sends a simple embed to the current channel. `text` should be formatted with | ' +
      'separating the title and description. For example: `this is a title | this is a description` ' +
      '(Manage Server permission needed)',
    usage = '<color> <text>'
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  @requireArgs(2)
  async command(message: Message, args: string[]) {
    await message.delete();

    if (
      message.member !== null &&
      !message.member?.permissions.has('ManageGuild')
    ) {
      return error(
        'You need to have the manage server permission to use this command',
        message
      );
    }

    if (args[0].startsWith('#')) {
      args[0] = args[0].slice();
    } else if (args[0].length !== 6) {
      return error('Please provide a valid color', message);
    }

    let providedEmbedColor = args[0];

    // Make sure the length of the provided color is 6 chars
    if (providedEmbedColor.length > 6) {
      providedEmbedColor = providedEmbedColor.slice(
        -(providedEmbedColor.length - 6)
      );
    } else if (providedEmbedColor.length < 6) {
      providedEmbedColor += '0'.repeat(6 - providedEmbedColor.length);
    }

    const embedColor = parseInt(providedEmbedColor, 16);

    // Removes the color argument from the array
    args = args.splice(1);

    const text = args.join(' ');
    const embedArray = text.includes('|') ? text.split('|') : [text];

    let embed = new EmbedBuilder().setColor(embedColor);
    if (embedArray[0] !== '' && embedArray[0] !== ' ') {
      embed = embed.setTitle(embedArray[0]);
    }

    if (embedArray[1] && embedArray[1] !== '' && embedArray[1] !== ' ') {
      embed = embed.setDescription(embedArray[1]);
    }

    const responseMessage = await message.channel.send({ embeds: [embed] });
    if (responseMessage.crosspostable) {
      responseMessage.crosspost();
    }
  }
}
