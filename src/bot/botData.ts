import { CommandClass } from '../types/discord.js';
import { Collection, EmbedBuilder } from 'discord.js';

export const botEmojis = {
  online: '<:online:979932796162293822>',
  idle: '<:idle:979932819730083850>',
  dnd: '<:dnd:979932833629995038>',
  offline: '<:offline:979932845210468362>',
};

export type CommandCollection = Collection<string, CommandClass>;

export type CommandCategory =
  | 'guildConfig'
  | 'info'
  | 'moderation'
  | 'minecraft'
  | 'externalApis'
  | 'misc';

/*
 * Object Keys should be filled out following the template below
 * <pre>
 * exampleCategory: {
 *   description: 'This field will show up under the description of the category',
 *     label: 'This will be the user facing name of the category',
 *     value: 'exampleCategory', // Value should be the same as the object key
 *     embed: new EmbedBuilder(),
 * }
 * </pre>
 */
export const categoryInfo: { [index: string]: CategoryInfo } = {
  guildConfig: {
    description:
      'Allows you to configure elements of the bot like the prefix in the current guild',
    label: 'Guild Config',
    value: 'guildConfig',
    embed: new EmbedBuilder(),
  },
  info: {
    description:
      'Contain information about the bot, like performance, invite, etc...',
    label: 'Info',
    value: 'info',
    embed: new EmbedBuilder(),
  },
  moderation: {
    description:
      'Useful for server moderation, allows you to ban, kick, set up auto mod (soon), etc...',
    label: 'Moderation',
    value: 'moderation',
    embed: new EmbedBuilder(),
  },
  minecraft: {
    description:
      'Allows you to check information on players like their skin, stats, etc...',
    label: 'Minecraft',
    value: 'minecraft',
    embed: new EmbedBuilder(),
  },
  externalApis: {
    description: 'Commands that use services from External APIs',
    label: 'External APIs',
    value: 'externalApis',
    embed: new EmbedBuilder(),
  },
  misc: {
    description:
      "Random useful commands that didn't fit well in any other category",
    label: 'Misc',
    value: 'misc',
    embed: new EmbedBuilder(),
  },
};

export interface CategoryInfo {
  description: string;
  label: string;
  value: string;
  embed: EmbedBuilder;
}
