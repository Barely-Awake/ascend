import { EmbedBuilder, Message } from 'discord.js';
import { CommandCategory } from '../../../types/discord.js';
import { botColors } from '../../../utils/discord/botData.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import config from '../../../utils/misc/readConfig.js';
import { unixToSeconds } from '../../../utils/misc/time.js';

export default class Performance {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'performance',
    category: CommandCategory = 'info',
    aliases: string[] | null = null,
    description = 'Sends stats about the bot\'s performance',
    usage = '',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, _: string[]) {
    const perfMsg = await message.channel.send('Checking Client Performance...');

    let clientUptime;
    if (message.client.uptime !== null)
      clientUptime = unixToSeconds(Date.now() - message.client.uptime);
    else
      clientUptime = 'Unknown';

    const embed = new EmbedBuilder()
      .setTitle(`Performance information on \`${config.botName}\``)
      .setColor(botColors[1])
      .addFields([
        {
          name: 'API Ping',
          value: `\`${Math.trunc(perfMsg.createdTimestamp - message.createdTimestamp)}\` ms`,
        },
        {
          name: 'Websocket Ping',
          value: `\`${message.client.ws.ping}\` ms`,
        },
        {
          name: 'Uptime',
          value: typeof clientUptime !== 'string' ?
            messageTimeStamp(clientUptime, 'R') :
            'Unknown',
        },
        {
          name: 'Memory Usage',
          value: `\`${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}\` MB`,
        },
      ]);

    perfMsg.edit({embeds: [embed]});
  }
}
