import { EmbedBuilder, Message } from 'discord.js';
import config from '../../utils/misc/readConfig.js';

export default function error(error: string, commandName: string, message: Message) {
  const embed = new EmbedBuilder()
    .setTitle(`Error with command \`${commandName}\``)
    .setColor('#ff0000')
    .setDescription(error)
    .setFooter({
      text: `Sent by ${config.botName}`,
    });

  return message.channel.send({embeds: [embed]});
}