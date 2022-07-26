import 'dotenv/config';

export function readConfig(): Config {
  return <Config>{
    token: process.env['TOKEN'],

    betaToken: process.env['BETA_TOKEN'],
    betaMode: process.env['BETA_MODE'] === 'true',

    prefix: process.env['PREFIX'],
    botName: process.env['BOT_NAME'],
    supportServerId: process.env['SUPPORT_SERVER_ID'],

    hypixelApiKey: process.env['HYPIXEL_API_KEY'],
    antiSniperApiKey: process.env['ANTI_SNIPER_API_KEY'],

    mongoUrl: process.env['MONGO_URL'],
  };
}

interface Config {
  token: string;

  betaToken: string;
  betaMode: boolean;

  prefix: string;
  botName: string;
  supportServerId: string;

  hypixelApiKey: string;
  antiSniperApiKey: string;

  mongoUrl: string;
}

const config = readConfig();
export { config as default };