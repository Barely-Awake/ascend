import { Client } from 'discord.js';
import { Settings } from './_event.js';

export default function (client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
}

export const settings: Settings = {
  once: true,
};
