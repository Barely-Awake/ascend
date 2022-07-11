import { ColorResolvable, MessageEmbed, MessageSelectOptionData } from 'discord.js';

export const botColors: ColorResolvable[] = [
  '#e0006f',
  '#a14b94',
  '#002da4',
];

export const botEmojis = {
  online: '<:online:979932796162293822>',
  idle: '<:idle:979932819730083850>',
  dnd: '<:dnd:979932833629995038>',
  offline: '<:offline:979932845210468362>',
};

export const categoryInfo: { [index: string]: CategoryInfo } = {
  config: {
    description: 'Allows you to configure elements of the bot like the prefix in the current guild',
    label: 'Config',
    value: 'config',
    embed: new MessageEmbed(),
  },
  info: {
    description: 'Contain information about the bot, like performance, invite, etc...',
    label: 'Info',
    value: 'info',
    embed: new MessageEmbed(),
  },
  moderation: {
    description: 'Useful for server moderation, allows you to ban, kick, set up auto mod (soon), etc...',
    label: 'Moderation',
    value: 'moderation',
    embed: new MessageEmbed(),
  },
  minecraft: {
    description: 'Allows you to check information on players like their skin, stats, etc...',
    label: 'Minecraft',
    value: 'minecraft',
    embed: new MessageEmbed(),
  },
  externalApis: {
    description: 'Commands that use services from External APIs',
    label: 'External APIs',
    value: 'externalApis',
    embed: new MessageEmbed(),
  },
  misc: {
    description: 'Random useful commands that didn\'t fit well in any other category',
    label: 'Misc',
    value: 'misc',
    embed: new MessageEmbed(),
  },
};

export interface CategoryInfo extends MessageSelectOptionData {
  embed: MessageEmbed;
}