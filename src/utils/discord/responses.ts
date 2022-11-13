import { EmbedBuilder, Message } from 'discord.js';

export function error(description: string, message: Message) {
  const embed = new EmbedBuilder()
    .setTitle("Sorry, I couldn't finish that command!")
    .setColor('#ff0000')
    .setDescription(description);

  return message.reply({ embeds: [embed] });
}
