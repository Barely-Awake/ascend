import 'dotenv/config';

export function readConfig(): Config {
  return <Config>{
    token: process.env['TOKEN'],
    prefix: process.env['PREFIX'],
    botName: process.env['BOT_NAME'],
    hypixelApiKey: process.env['HYPIXEL_API_KEY'],
    mongo: {
      host: process.env['MONGO_HOST'],
      port: process.env['MONGO_PORT'],
      userName: process.env['MONGO_USER'],
      password: process.env['MONGO_PASSWORD'],
      url: `mongodb://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@\
      ${process.env['MONGO_HOST']}:${process.env['MONGO_PORT']}`,
    },
  };
}

interface Config {
  token: string;
  prefix: string;
  botName: string;
  hypixelApiKey: string;
  mongo: {
    host: string;
    port: string;
    userName: string;
    password: string;
    url: string;
  };
}

const config = readConfig();
export { config as default };