import { Client, Collection, Intents } from 'discord.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';
import config from './utils/readConfig.js';
import pkg from 'canvas';

const {registerFont} = pkg;

registerFont('assets/fonts/sonus-light.ttf', {family: 'Sonus'});
registerFont('assets/fonts/sonus-bold.ttf', {family: 'Sonus Bold'});

registerFont('assets/fonts/minecraft.otf', {family: 'Minecraft'});
registerFont('assets/fonts/minecraft-bold.otf', {family: 'Minecraft Bold'});
registerFont('assets/fonts/minecraft-italic.otf', {family: 'Minecraft Italic'});
registerFont('assets/fonts/minecraft-bold-italic.otf', {family: 'Minecraft Bold Italic'});

const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.DIRECT_MESSAGES,
);

const client = new Client({intents: intents});
const clientCollections = {
  commands: new Collection(),
};

export { clientCollections as default };

commandAdder(clientCollections.commands);
eventHandler(client);

client.login(config.token);