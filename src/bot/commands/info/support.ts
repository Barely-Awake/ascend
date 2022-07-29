import { Message } from 'discord.js';
import { CommandInfo } from '../_command.js';

export default function (message: Message, _: string[]) {
  message.channel.send('For support please join discord.gg/PpdbKXKgT3');
}

export const commandInfo: CommandInfo = {
  name: 'support',
  category: 'info',
  description: 'Provides the support discord invite link',
  usage: '',
};