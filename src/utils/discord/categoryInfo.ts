import { MessageEmbed, MessageSelectOptionData } from 'discord.js';

export default <{ [index: string]: CategoryInfo }>{
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