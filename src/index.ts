import config from './utils/misc/readConfig.js';
import canvasPkg from 'canvas';
import { ActivityType, GatewayIntentBits } from 'discord.js';
import mongoosePkg from 'mongoose';
import { startDiscordBot } from './bot/startUp.js';

const { connect } = mongoosePkg;
const { registerFont } = canvasPkg;

registerFont('assets/fonts/sonus-light.ttf', { family: 'Sonus' });
registerFont('assets/fonts/sonus-bold.ttf', { family: 'Sonus Bold' });

registerFont('assets/fonts/minecraft.otf', { family: 'Minecraft' });
registerFont('assets/fonts/minecraft-bold.otf', { family: 'Minecraft Bold' });
registerFont('assets/fonts/minecraft-italic.otf', {
  family: 'Minecraft Italic',
});
registerFont('assets/fonts/minecraft-bold-italic.otf', {
  family: 'Minecraft Bold Italic',
});

connect(config.mongoUrl).then(() => {
  console.log('Connected to MongoDB');
});
const client = startDiscordBot();

client.login(config.betaMode ? config.betaToken : config.token);
