import {
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js';
import { DescriptionTypes } from './_example.js';
import { readdir } from 'fs/promises';
import config from '../../utils/misc/readConfig.js';
import categoryInfo from '../../utils/discord/categoryInfo.js';

const commandsCache: { [index: string]: DescriptionTypes } = {};

cacheCommands()
  .then(makeCategoryEmbeds);

export default async function (message: Message, _: string[]) {
  message.channel.sendTyping();

  const baseEmbed = new MessageEmbed()
    .setTitle(`${config.botName} Help`)
    .setDescription(`<> - Required Argument\n[] - Option Argument\n${config.prefix} - Bot Prefix`);

  const selectMenuOptions: MessageSelectOptionData[] = [];
  for (const category in categoryInfo) {
    baseEmbed.addField(categoryInfo[category].label, categoryInfo[category].description || '');
    const categoryDeepCopy = JSON.parse(JSON.stringify(categoryInfo[category]));
    delete categoryDeepCopy.embed;
    selectMenuOptions.push(categoryDeepCopy);
  }

  const actionRow = new MessageActionRow()
    .addComponents(new MessageSelectMenu()
      .setCustomId('categorySelector')
      .setPlaceholder('Categories')
      .addOptions(selectMenuOptions));

  const sentMessage = await message.channel.send({
    embeds: [baseEmbed],
    components: [actionRow],
  });

  const interactionCollector = new InteractionCollector(message.client, {
    message: sentMessage,
    time: 120 * 1000,
  });

  interactionCollector.on('collect', (interaction) => {
    if (!interaction.isSelectMenu())
      return;

    if (interaction.user.id !== message.author.id)
      return interaction.reply({
        content: 'You can\'t do that to this message!',
        ephemeral: true,
      });

    interaction.update({
      embeds: [categoryInfo[interaction.values[0]].embed],
      components: [actionRow],
    });
  });
}

function makeCategoryEmbeds() {
  for (const category in categoryInfo) {
    categoryInfo[category].embed = new MessageEmbed()
      .setTitle(`${config.botName} Help`)
      .setDescription(`<> - Required Argument\n[] - Option Argument`);

    for (const command in commandsCache) {
      if (categoryInfo[category].value !== commandsCache[command].category)
        continue;

      categoryInfo[category].embed.addField(
        `${commandsCache[command].name} ${commandsCache[command].usage}`,
        commandsCache[command].description,
      );
    }
  }
}

async function cacheCommands() {

  const folders = await readdir('./dist/bot/commands');

  for (const folder of folders) {
    if (folder.includes('.'))
      continue;

    const commandFiles = await readdir(`./dist/bot/commands/${folder}`);

    for (const file of commandFiles) {
      if (!file.endsWith('.js'))
        continue;
      const commandData: CommandData = await import(`./${folder}/${file}`);
      commandsCache[commandData.description.name] = commandData.description;
    }
  }
}

type CommandFunction = (message: Message, args: string[]) => void | Promise<void>

interface CommandData {
  default: CommandFunction;
  description: DescriptionTypes;
}

export const description: DescriptionTypes = {
  name: 'help',
  category: 'info',
  description: 'Shows help message.',
  usage: '',
};