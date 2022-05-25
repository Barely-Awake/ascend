export default interface playerStatsTypes {
  displayName: string;
  rank: string;

  lastLogIn: number | null;
  lastLogOut: number | null;

  bedWars: {
    experience: number

    [key: string]: genericStats | number;
    gamesPlayed: genericStats

    winStreak: genericStats
    winRate: genericStats

    finalKills: genericStats
    finalDeaths: genericStats
    finalKillDeathRatio: genericStats

    wins: genericStats
    losses: genericStats
    winLossRatio: genericStats

    kills: genericStats
    deaths: genericStats
    killDeathRatio: genericStats

    bedsBroken: genericStats
    bedsLost: genericStats
    bedBreakLossRatio: genericStats
  };
}

interface genericStats {
  [key: string]: number | null | undefined;

  overAll: number | null;
  eight_one: number | null;
  eight_two: number | null;
  four_three: number | null;
  four_four: number | null;
  two_four: number | null;
}