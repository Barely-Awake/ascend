import { MessageEmbed, MessageSelectOptionData } from 'discord.js';

export default <{ [index: string]: CategoryInfo }>{
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
  externalProfiles: {
    description: 'Allows you to request info about other profiles, for example a GitHub account',
    label: 'Profiles',
    value: 'externalProfiles',
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