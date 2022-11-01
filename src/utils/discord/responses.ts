import { EmbedBuilder, Message } from 'discord.js';
import config from '../misc/readConfig.js';

export function error(description: string, message: Message) {
  const embed = new EmbedBuilder()
    .setTitle("Sorry, I couldn't finish that command.")
    .setColor('#ff0000')
    .setDescription(description)
    .setFooter({
      text: `Sent by ${config.botName}`,
    });

  return message.reply({ embeds: [embed] });
}
