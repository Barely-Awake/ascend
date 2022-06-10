import { model, Schema } from 'mongoose';

const PlayerSchema = new Schema({
  discordId: String,
  playerUuid: String,
}, {timestamps: true});

const playerModel = model('Player', PlayerSchema);

export { playerModel as default };