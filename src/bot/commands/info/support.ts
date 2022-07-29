// noinspection SpellCheckingInspection

import { Message } from 'discord.js';
import { DescriptionTypes } from '../_example.js';

export default function (message: Message, _: string[]) {
  message.channel.send('For support please join discord.gg/PpdbKXKgT3');
}

export const description: DescriptionTypes = {
  name: 'support',
  category: 'info',
  description: 'Provides the support discord invite link',
  usage: '',
};