export interface DenickEndPoint {
  success: boolean;
  player?: DenickPlayer;
  data?: null;
  cause?: string;
}

interface DenickPlayer {
  uuid: string;
  dashed_uuid: string;
  nick_uuid: string;
  dashed_nick_uuid: string;
  date: number;
  ign: string;
  nick: string;
}

export interface WinStreakEndPoint {
  success: boolean;
  player?: WinStreakEstimatePlayer;
  cause?: string;
}

interface WinStreakEstimatePlayer {
  uuid: string;
  ign: string;
  ign_lower: string;
  accurate: boolean;
  date: number;
  data: Data;
}

interface Data {
  overall_winstreak: number;
  eight_one_winstreak: number;
  eight_two_winstreak: number;
  four_three_winstreak: number;
  four_four_winstreak: number;
  two_four_winstreak: number;
  castle_winstreak: number;
  eight_one_rush_winstreak: number;
  eight_two_rush_winstreak: number;
  four_four_rush_winstreak: number;
  eight_one_ultimate_winstreak: number;
  eight_two_ultimate_winstreak: number;
  four_four_ultimate_winstreak: number;
  eight_two_armed_winstreak: number;
  four_four_armed_winstreak: number;
  eight_two_lucky_winstreak: number;
  four_four_lucky_winstreak: number;
  eight_two_voidless_winstreak: number;
  four_four_voidless_winstreak: number;
  tourney_bedwars_two_four_0_winstreak: number;
  tourney_bedwars4s_0_winstreak: number;
  tourney_bedwars4s_1_winstreak: number;
  eight_two_underworld_winstreak: number;
  four_four_underworld_winstreak: number;
  eight_two_swap_winstreak: number;
  four_four_swap_winstreak: number;
}