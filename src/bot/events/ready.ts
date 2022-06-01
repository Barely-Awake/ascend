import { Client } from 'discord.js';

export default async function (client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
  client.user?.setStatus('idle');
  client.user?.setPresence({
    activities: [
      {
        name: 'Happy pride month!',
        type: 'PLAYING',
      },
    ],
  });
}

export const settings = {
  once: true,
};