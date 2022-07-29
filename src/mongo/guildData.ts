import mongoosePkg from 'mongoose';

const {model, Schema} = mongoosePkg;

interface IGuild {
  serverId: string;

  prefix: string;
  muteRole: string | null;
}

const GuildSchema = new Schema<IGuild>({
  serverId: String,

  prefix: String,
  muteRole: String,
});

const GuildData = model<IGuild>('Guild', GuildSchema);

export { GuildData as default };