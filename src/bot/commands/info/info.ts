import { Client, EmbedBuilder, Message, Team, User, version } from 'discord.js';
import { messageTimeStamp } from '../../../utils/discord/misc.js';
import config from '../../../utils/misc/readConfig.js';
import { unixToSeconds } from '../../../utils/misc/time.js';
import { botColors, CommandCategory } from '../../botData.js';

export default class Info {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'info',
    category: CommandCategory = 'info',
    aliases: string[] | null = null,
    description = `Displays information about \`${config.botName}\``,
    usage = '',
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, _: string[]) {
    const {client} = message;

    const applicationOwner = await getApplicationOwner(client);
    const clientUptime = getClientUptime(client);

    const infoEmbed = new EmbedBuilder()
      .setTitle(`Information on ${config.botName}`)
      .setColor(botColors[1])
      .setAuthor({
        name: 'Barely Awake',
        url: 'https://github.com/barely-awake',
        iconURL: 'https://avatars.githubusercontent.com/u/80858965?v=4',
      })

      .setDescription(`${config.botName} is an open source bot made by Barely Awake. ` +
        `The source code can be found at https://github.com/Barely-Awake/ascend. ` +
        `${config.botName} features a lot of useful moderation commands. Currently the direction is being an open ` +
        `source replacement for bots in your server. Right now it's still in early development so it isn't ` +
        `that yet, but the dev team is working hard to reach that goal as soon as possible.`)

      .addFields([
        {
          name: 'Credits',
          value: 'Antisniper - for providing the denicker used in both the denick and findnick commands',
        },
        {
          name: 'Version',
          value: `\`${process.env.npm_package_version || 'Unknown'}\``,
        },
        {
          name: 'Ping',
          value: `\`${client.ws.ping}\` ms`,
        },
        {
          name: 'Up Since',
          value: typeof clientUptime !== 'string' ?
            messageTimeStamp(clientUptime, 'R') :
            'Unknown',
        },
        {
          name: 'Instance Host',
          value: applicationOwner,
        },
        {
          name: 'Server Count',
          value: client.guilds.cache.size.toString(),
        },
        {
          name: 'User Count',
          value: client.users.cache.size.toString(),
        },
        {
          name: 'Discord.js Version',
          value: version,
        },
      ]);

    if ((message.guild || {}).id !== config.supportServerId)
      await message.reply({
        content: `Join ${config.botName}'s support server for information on changes to the bot and beta access! ` +
          `https://discord.gg/PpdbKXKgT3`,
        embeds: [infoEmbed],
      });
    else
      await message.reply({
        embeds: [infoEmbed],
      });
  }
}

async function getApplicationOwner(client: Client) {
  const clientApplication = await client.application?.fetch();
  let applicationOwner;

  if (clientApplication?.owner instanceof User)
    applicationOwner = clientApplication?.owner;
  else if (clientApplication?.owner instanceof Team)
    applicationOwner = clientApplication?.owner?.owner;

  applicationOwner = applicationOwner || 'Unknown';
  return applicationOwner.toString();
}

function getClientUptime(client: Client) {
  let clientUptime;
  if (client.uptime !== null)
    clientUptime = unixToSeconds(Date.now() - client.uptime);
  else
    clientUptime = 'Unknown';

  return clientUptime;
}
