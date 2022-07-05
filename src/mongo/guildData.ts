import pkg from 'mongoose';

const {model, Schema} = pkg;

interface IGuild {
  serverId: string;

  prefix: string;
}

const GuildSchema = new Schema<IGuild>({
  serverId: String,

  prefix: String,
});

const GuildData = model<IGuild>('Guild', GuildSchema);

export { GuildData as default };