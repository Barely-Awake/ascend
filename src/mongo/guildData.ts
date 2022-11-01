import mongoosePkg from 'mongoose';

const { model, Schema } = mongoosePkg;

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

export const GuildData = model<IGuild>('Guild', GuildSchema);

interface IMutedUsers {
  guildId: string;
  userId: string;
  muteRoleId: string;
  expiresAt: number | null;
}

const MutedUsersSchema = new Schema<IMutedUsers>({
  guildId: String,
  userId: String,
  muteRoleId: String,
  expiresAt: { type: Number, required: false },
});

export const MutedUserData = model<IMutedUsers>('MutedUsers', MutedUsersSchema);
