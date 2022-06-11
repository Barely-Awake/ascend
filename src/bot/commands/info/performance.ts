import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import config from '../../../utils/readConfig.js';
import botColors from '../../../utils/discord/botColors.js';
import messageTimeStamp from '../../../utils/discord/messageTimeStamp.js';
import unixToSeconds from '../../../utils/misc/unixToSeconds.js';

export default async function (message: Message, args: string[]) {
  const perfMsg = await message.channel.send('Checking Client Performance...');

  let clientUptime;
  if (message.client.uptime !== null)
    clientUptime = unixToSeconds((+new Date()) - message.client.uptime);
  else
    clientUptime = 'Unknown';

  const embed = new MessageEmbed()
    .setTitle(`Performance information on \`${config.botName}\``)
    .setColor(botColors[1])
    .addField('API Ping', `\`${Math.trunc(perfMsg.createdTimestamp - message.createdTimestamp)}\` ms`)
    .addField('Websocket Ping', `\`${message.client.ws.ping}\` ms`)
    .addField('Uptime', typeof clientUptime !== 'string' ?
      messageTimeStamp(clientUptime, 'R') :
      'Unknown')
    .addField('Memory Usage', `\`${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}\` MB`);

  perfMsg.edit({content: 'Client Performance', embeds: [embed]})
}

export const description: DescriptionTypes = {
  name: 'performance',
  description: 'Sends stats about the bot\'s performance',
  usage: '',
};