import 'dotenv/config';

export function readConfig(): Config {
  return <Config>{
    token: process.env['TOKEN'],
    betaToken: process.env['BETA_TOKEN'],
    betaMode: process.env['BETA_MODE'] === 'true',
    prefix: process.env['PREFIX'],
    botName: process.env['BOT_NAME'],
    hypixelApiKey: process.env['HYPIXEL_API_KEY'],
    keathizApiKey: process.env['KEATHIZ_API_KEY'],
    mongoUrl: process.env['MONGO_URL'],
  };
}

interface Config {
  token: string;
  betaToken: string;
  betaMode: boolean;
  prefix: string;
  botName: string;
  hypixelApiKey: string;
  keathizApiKey: string;
  mongoUrl: string;
}

const config = readConfig();
export { config as default };