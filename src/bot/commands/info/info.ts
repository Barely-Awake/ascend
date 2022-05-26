import { Message, MessageEmbed, User, Team } from 'discord.js';
import { DescriptionTypes } from '../_example.js';
import config from '../../../utils/readConfig.js';

export default async function (message: Message, args: string[]) {
  let clientApplication = await message.client.application?.fetch();
  let applicationOwner;

  if (clientApplication?.owner instanceof User)
    applicationOwner = (clientApplication?.owner || 'Unknown').toString();
  else if (clientApplication?.owner instanceof Team)
    applicationOwner = (clientApplication?.owner.owner || 'Unknown').toString();
  else
    applicationOwner = 'Unknown';

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
      `just being a useful bot.\n\nThis instance of the bot is being hosted by ${applicationOwner}`,
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
