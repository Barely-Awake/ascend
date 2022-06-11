import pkg from 'mongoose';

const {model, Schema} = pkg;

interface IPlayer {
  discordId: string;
  playerUuid: string;
}

const PlayerSchema = new Schema<IPlayer>({
  discordId: String,
  playerUuid: String,
}, {timestamps: true});

const Player = model<IPlayer>('Player', PlayerSchema);

export { Player as default };