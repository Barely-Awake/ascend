import config from '../../utils/misc/readConfig.js';
import {
  CommandCategory,
  CommandCollection,
  categoryInfo,
} from '../botData.js';
import {
  ActionRowBuilder,
  EmbedBuilder,
  InteractionCollector,
  Message,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
} from 'discord.js';

export default class Help {
  public name: string;
  public category: CommandCategory;
  public aliases: string[] | null;
  public description: string;
  public usage: string;

  constructor(
    name = 'help',
    category: CommandCategory = 'info',
    aliases: string[] | null = ['h', 'commands'],
    description = 'Shows help message.',
    usage = ''
  ) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
  }

  async command(message: Message, _: string[]) {
    const baseEmbed = new EmbedBuilder()
      .setTitle(`${config.botName} Help`)
      .setDescription(
        `<> - Required Argument\n[] - Option Argument\n${config.prefix} - Bot Prefix`
      );

    const selectMenuOptions: SelectMenuComponentOptionData[] = [];

    selectMenuOptions.push({
      label: 'Command Categories',
      value: 'commandCategories',
      description: 'Lists command categories as well as their description',
    });

    for (const key of Object.keys(categoryInfo)) {
      baseEmbed.addFields([
        {
          name: categoryInfo[key].label,
          value: categoryInfo[key].description || '',
        },
      ]);

      selectMenuOptions.push({
        label: categoryInfo[key].label,
        value: categoryInfo[key].value,
        description: categoryInfo[key].description,
      });
    }

    const actionRow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId('categorySelector')
        .setPlaceholder('Select an Option!')
        .addOptions(selectMenuOptions)
    );

    const sentMessage = await message.reply({
      embeds: [baseEmbed],
      components: [actionRow],
    });

    const interactionCollector = new InteractionCollector(message.client, {
      message: sentMessage,
      time: 120 * 1000,
    });

    interactionCollector.on('collect', (interaction) => {
      if (!interaction.isSelectMenu()) {
        return;
      }

      if (interaction.user.id !== message.author.id) {
        interaction.reply({
          content: "You can't do that to this message!",
        });
        return;
      }

      if (interaction.values[0] === 'commandCategories') {
        interaction.update({
          embeds: [baseEmbed],
          components: [actionRow],
        });
      } else {
        interaction.update({
          embeds: [categoryInfo[interaction.values[0]].embed],
          components: [actionRow],
        });
      }
    });

    interactionCollector.on('end', () => {
      sentMessage.edit({
        embeds: sentMessage.embeds,
        components: [],
      });
    });
  }
}

export function makeHelpEmbeds(commands: CommandCollection) {
  for (const key of Object.keys(categoryInfo)) {
    categoryInfo[key].embed = new EmbedBuilder()
      .setTitle(`${config.botName} Help`)
      .setDescription('<> - Required Argument\n[] - Option Argument');

    commands.forEach((commandClass, commandName) => {
      if (categoryInfo[key].value !== commandClass.category) {
        return;
      }

      if (commandName !== commandClass.name) {
        return;
      }

      categoryInfo[key].embed.addFields([
        {
          name: `${commandClass.name} ${commandClass.usage}`,
          value: commandClass.description,
        },
      ]);
    });
  }
}
