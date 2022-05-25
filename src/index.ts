import { Client, Collection, Intents } from 'discord.js';
import config from './utils/readConfig.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';

const intents = new Intents();
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({intents: intents});
const clientCollections = {
  commands: new Collection(),
};

export { clientCollections as default };

commandAdder(clientCollections.commands);
eventHandler(client);

client.login(config.token);