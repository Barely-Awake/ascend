import { EmbedBuilder, Message } from 'discord.js';
import { botColors } from '../../../utils/discord/botData.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import config from '../../../utils/misc/readConfig.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';
import { CommandInfo } from '../_command.js';

export default async function (message: Message, _: string[]) {
  const perfMsg = await message.channel.send('Checking Client Performance...');

  let clientUptime;
  if (message.client.uptime !== null)
    clientUptime = unixToSeconds((+new Date()) - message.client.uptime);
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

export const commandInfo: CommandInfo = {
  name: 'performance',
  category: 'info',
  description: 'Sends stats about the bot\'s performance',
  usage: '',
};