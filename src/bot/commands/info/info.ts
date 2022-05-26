import { Message, MessageEmbed } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import config from '../../../utils/readConfig.js';

export default async function (message: Message, args: string[]) {
  const infoEmbed = new MessageEmbed()
    .setTitle(`Information on ${config.botName}`)
    .setColor(config.colors[1])
    .setAuthor({
      name: 'Barely Awake',
      url: 'https://github.com/barely-awake',
      iconURL: 'https://avatars.githubusercontent.com/u/80858965?v=4',
    })
    .setDescription(`${config.botName} is an open source bot made by Barely Awake. ` +
      `The source code can be found at https://github.com/Barely-Awake/raging-bisexual. ` +
      `Currently used in over ${message.client.guilds.cache.size} guilds with ${message.client.users.cache.size} ` +
      `members, ${config.botName} features a lot of random commands. Currently there isn't a real direction besides ` +
      `just being a useful bot.`,
    )
    .setFooter({
      text: 'Made with love & discord.js',
      iconURL: config.footerIcon,
    });

  message.channel.send({embeds: [infoEmbed]});
}

export const description: DescriptionTypes = {
  name: 'info',
  description: `Displays information about \`${config.botName}\``,
  usage: '',
};
