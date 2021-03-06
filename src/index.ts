import canvasPkg from 'canvas';
import { ActivityType, Client, Collection, GatewayIntentBits, IntentsBitField } from 'discord.js';
import mongoosePkg from 'mongoose';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';
import config from './utils/misc/readConfig.js';

const {connect} = mongoosePkg;
const {registerFont} = canvasPkg;

registerFont('assets/fonts/sonus-light.ttf', {family: 'Sonus'});
registerFont('assets/fonts/sonus-bold.ttf', {family: 'Sonus Bold'});

registerFont('assets/fonts/minecraft.otf', {family: 'Minecraft'});
registerFont('assets/fonts/minecraft-bold.otf', {family: 'Minecraft Bold'});
registerFont('assets/fonts/minecraft-italic.otf', {family: 'Minecraft Italic'});
registerFont('assets/fonts/minecraft-bold-italic.otf', {family: 'Minecraft Bold Italic'});

const intents = new IntentsBitField().add([
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
]);

export const client = new Client({
  intents: intents,
  presence: {
    status: 'idle',
    activities: [
      {
        name: `@${config.botName} help`,
        type: ActivityType.Watching,
      },
    ],
  },
});
client.commands = new Collection();
client.cache = {
  commandInfo: {},
  prefixes: {},
};

export const mongoClient = connect(config.mongoUrl);

commandAdder(client.commands);
eventHandler(client);

client.login(config.betaMode ? config.betaToken : config.token);