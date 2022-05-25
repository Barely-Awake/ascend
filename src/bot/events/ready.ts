import { Client } from 'discord.js';

export default async function (client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
}

export const settings = {
  once: true,
};