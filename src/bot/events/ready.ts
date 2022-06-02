import { Client } from 'discord.js';

export default function (client: Client): void  {
  console.log(`Logged in as ${client.user?.tag}`);
}

export const settings = {
  once: true,
};