export default interface playerStatsTypes {
  displayName: string;
  rank: string;

  lastLogIn: number | null;
  lastLogOut: number | null;

  socialMedia: SocialMedia;

  bedWars: BedWarsStats;
}

interface SocialMedia {
  hypixel: string | null;
  discord: string | null;
  twitch: string | null;
  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
}

interface BedWarsStats {
  experience: number;
  gamesPlayed: GenericStats;
  winStreak: GenericStats;
  winRate: GenericStats;
  finalKills: GenericStats;
  finalDeaths: GenericStats;
  finalKillDeathRatio: GenericStats;
  wins: GenericStats;
  losses: GenericStats;
  winLossRatio: GenericStats;
  kills: GenericStats;
  deaths: GenericStats;
  killDeathRatio: GenericStats;
  bedsBroken: GenericStats;
  bedsLost: GenericStats;
  bedBreakLossRatio: GenericStats;

  [key: string]: GenericStats | number;
}

interface GenericStats {
  overAll: number | null;
  eight_one: number | null;
  eight_two: number | null;
  four_three: number | null;
  four_four: number | null;
  two_four: number | null;

  [key: string]: number | null | undefined;
}