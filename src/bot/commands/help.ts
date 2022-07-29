import {
  ActionRowBuilder,
  EmbedBuilder,
  InteractionCollector,
  Message,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
} from 'discord.js';
import { readdir } from 'fs/promises';
import { categoryInfo } from '../../utils/discord/botData.js';
import config from '../../utils/misc/readConfig.js';
import { CommandInfo } from './_command.js';

const commandCache: { [index: string]: CommandInfo } = {};

cacheCommands()
  .then(makeCategoryEmbeds);

export default async function (message: Message, _: string[]) {
  message.channel.sendTyping();

  const baseEmbed = new EmbedBuilder()
    .setTitle(`${config.botName} Help`)
    .setDescription(`<> - Required Argument\n[] - Option Argument\n${config.prefix} - Bot Prefix`);

  const selectMenuOptions: SelectMenuComponentOptionData[] = [];
  for (const key of Object.keys(categoryInfo)) {
    baseEmbed.addFields([{
      name: categoryInfo[key].label,
      value: categoryInfo[key].description || '',
    }]);
    const categoryDeepCopy = JSON.parse(JSON.stringify(categoryInfo[key]));
    delete categoryDeepCopy.embed;
    selectMenuOptions.push(categoryDeepCopy);
  }

  const actionRow = new ActionRowBuilder<SelectMenuBuilder>()
    .addComponents(new SelectMenuBuilder()
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

    if (interaction.user.id !== message.author.id) {
      interaction.reply({
        content: 'You can\'t do that to this message!',
      });
      return;
    }
    interaction.update({
      embeds: [categoryInfo[interaction.values[0]].embed],
      components: [actionRow],
    });
  });

  interactionCollector.on('end', () => {
    sentMessage.edit({
      embeds: sentMessage.embeds,
      components: [],
    });
  });
}

function makeCategoryEmbeds() {
  for (const key of Object.keys(categoryInfo)) {
    categoryInfo[key].embed = new EmbedBuilder()
      .setTitle(`${config.botName} Help`)
      .setDescription(`<> - Required Argument\n[] - Option Argument`);

    for (const key of Object.keys(commandCache)) {
      if (categoryInfo[key].value !== commandCache[key].category)
        continue;

      categoryInfo[key].embed.addFields([{
        name: `${commandCache[key].name} ${commandCache[key].usage}`,
        value: commandCache[key].description,
      }]);
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
      commandCache[commandData.commandInfo.name] = commandData.commandInfo;
    }
  }
}

type CommandFunction = (message: Message, args: string[]) => void | Promise<void>

interface CommandData {
  default: CommandFunction;
  commandInfo: CommandInfo;
}

export const commandInfo: CommandInfo = {
  name: 'help',
  category: 'info',
  description: 'Shows help message.',
  usage: '',
};