import { ColorResolvable } from 'discord.js';
import { readFileSync } from 'fs';

export function readConfig(): Config {
  const configFile = readFileSync('config.json');
  return JSON.parse(configFile.toString());
}

interface Config {
  token: string;
  prefix: string;
  botName: string;
  colors: ColorResolvable[];
  emojis: {
    online: string;
    idle: string;
    dnd: string;
    offline: string;
  };
  footerIcon: string;
  hypixelApiKey: string;
}

const config = readConfig();
export { config as default };