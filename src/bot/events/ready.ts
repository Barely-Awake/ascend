import { Settings } from './_event.js';
import { Client } from 'discord.js';

export default function (client: Client) {
  console.log(`Client ready, logged in as ${client.user?.tag}!`);
}

export const settings: Settings = {
  once: true,
};
