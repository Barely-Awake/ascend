import playerStatsTypes from '../../types/playerStatsTypes.js';
import { Player } from '../../types/hypixelResponseTypes.js';
import tagCalc from './rankUtils.js';

export default function (playerStats: Player): playerStatsTypes {
  const bedWarsStats = playerStats.stats?.Bedwars;

  return <playerStatsTypes>{
    displayName: playerStats.displayname,
    rank: (tagCalc.getString(tagCalc.calcTag(playerStats)) === '&7' ?
      tagCalc.getString(tagCalc.calcTag(playerStats)) :
      tagCalc.getString(tagCalc.calcTag(playerStats)) + ' ').replace(/&/g, '§'),

    lastLogIn: playerStats.lastLogin || null,
    lastLogOut: playerStats.lastLogout || null,

    socialMedia: {
      hypixel: playerStats.socialMedia?.links?.HYPIXEL || null,
      discord: playerStats.socialMedia?.links?.DISCORD || null,
      twitch: playerStats.socialMedia?.links?.TWITCH || null,
      instagram: playerStats.socialMedia?.links?.INSTAGRAM || null,
      youtube: playerStats.socialMedia?.links?.YOUTUBE || null,
      twitter: playerStats.socialMedia?.links?.TWITTER || null,
    },

    bedWars: {
      experience: bedWarsStats?.Experience || 0,

      gamesPlayed: {
        overAll: bedWarsStats?.games_played_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_games_played_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_games_played_bedwars || 0,
        four_three: bedWarsStats?.four_three_games_played_bedwars || 0,
        four_four: bedWarsStats?.four_four_games_played_bedwars || 0,
        two_four: bedWarsStats?.two_four_games_played_bedwars || 0,
      },

      winStreak: {
        overAll: bedWarsStats?.winstreak !== undefined ? bedWarsStats?.winstreak : null,
        eight_one: bedWarsStats?.eight_one_winstreak !== undefined ? bedWarsStats?.eight_one_winstreak : null,
        eight_two: bedWarsStats?.eight_two_winstreak !== undefined ? bedWarsStats?.eight_two_winstreak : null,
        four_three: bedWarsStats?.four_three_winstreak !== undefined ? bedWarsStats?.four_three_winstreak : null,
        four_four: bedWarsStats?.four_four_winstreak !== undefined ? bedWarsStats?.four_four_winstreak : null,
        two_four: bedWarsStats?.two_four_winstreak !== undefined ? bedWarsStats?.two_four_winstreak : null,
      },
      winRate: {
        overAll: (bedWarsStats?.wins_bedwars || 0) / (bedWarsStats?.games_played_bedwars || 1),
        eight_one: (bedWarsStats?.eight_one_wins_bedwars || 0) / (bedWarsStats?.eight_one_games_played_bedwars || 1),
        eight_two: (bedWarsStats?.eight_two_wins_bedwars || 0) / (bedWarsStats?.eight_two_games_played_bedwars || 1),
        four_three: (bedWarsStats?.four_three_wins_bedwars || 0) / (bedWarsStats?.four_three_games_played_bedwars || 1),
        four_four: (bedWarsStats?.four_four_wins_bedwars || 0) / (bedWarsStats?.four_four_games_played_bedwars || 1),
        two_four: (bedWarsStats?.two_four_wins_bedwars || 0) / (bedWarsStats?.two_four_games_played_bedwars || 1),
      },

      finalKills: {
        overAll: bedWarsStats?.final_kills_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_final_kills_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_final_kills_bedwars || 0,
        four_three: bedWarsStats?.four_three_final_kills_bedwars || 0,
        four_four: bedWarsStats?.four_four_final_kills_bedwars || 0,
        two_four: bedWarsStats?.two_four_final_kills_bedwars || 0,
      },
      finalDeaths: {
        overAll: bedWarsStats?.final_deaths_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_final_deaths_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_final_deaths_bedwars || 0,
        four_three: bedWarsStats?.four_three_final_deaths_bedwars || 0,
        four_four: bedWarsStats?.four_four_final_deaths_bedwars || 0,
        two_four: bedWarsStats?.two_four_final_deaths_bedwars || 0,
      },
      finalKillDeathRatio: {
        overAll: (bedWarsStats?.final_kills_bedwars || 0) / (bedWarsStats?.final_deaths_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_final_kills_bedwars || 0) / (bedWarsStats?.eight_one_final_deaths_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_final_kills_bedwars || 0) / (bedWarsStats?.eight_two_final_deaths_bedwars || 0),
        four_three: (bedWarsStats?.four_three_final_kills_bedwars || 0) / (bedWarsStats?.four_three_final_deaths_bedwars || 0),
        four_four: (bedWarsStats?.four_four_final_kills_bedwars || 0) / (bedWarsStats?.four_four_final_deaths_bedwars || 0),
        two_four: (bedWarsStats?.two_four_final_kills_bedwars || 0) / (bedWarsStats?.two_four_final_deaths_bedwars || 0),
      },

      wins: {
        overAll: bedWarsStats?.wins_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_wins_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_wins_bedwars || 0,
        four_three: bedWarsStats?.four_three_wins_bedwars || 0,
        four_four: bedWarsStats?.four_four_wins_bedwars || 0,
        two_four: bedWarsStats?.two_four_wins_bedwars || 0,
      },
      losses: {
        overAll: bedWarsStats?.losses_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_losses_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_losses_bedwars || 0,
        four_three: bedWarsStats?.four_three_losses_bedwars || 0,
        four_four: bedWarsStats?.four_four_losses_bedwars || 0,
        two_four: bedWarsStats?.two_four_losses_bedwars || 0,
      },
      winLossRatio: {
        overAll: (bedWarsStats?.wins_bedwars || 0) / (bedWarsStats?.losses_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_wins_bedwars || 0) / (bedWarsStats?.eight_one_losses_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_wins_bedwars || 0) / (bedWarsStats?.eight_two_losses_bedwars || 0),
        four_three: (bedWarsStats?.four_three_wins_bedwars || 0) / (bedWarsStats?.four_three_losses_bedwars || 0),
        four_four: (bedWarsStats?.four_four_wins_bedwars || 0) / (bedWarsStats?.four_four_losses_bedwars || 0),
        two_four: (bedWarsStats?.two_four_wins_bedwars || 0) / (bedWarsStats?.two_four_losses_bedwars || 0),
      },

      kills: {
        overAll: bedWarsStats?.kills_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_kills_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_kills_bedwars || 0,
        four_three: bedWarsStats?.four_three_kills_bedwars || 0,
        four_four: bedWarsStats?.four_four_kills_bedwars || 0,
        two_four: bedWarsStats?.two_four_kills_bedwars || 0,
      },
      deaths: {
        overAll: bedWarsStats?.deaths_bedwars,
        eight_one: bedWarsStats?.eight_one_deaths_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_deaths_bedwars || 0,
        four_three: bedWarsStats?.four_three_deaths_bedwars || 0,
        four_four: bedWarsStats?.four_four_deaths_bedwars || 0,
        two_four: bedWarsStats?.two_four_deaths_bedwars || 0,
      },
      killDeathRatio: {
        overAll: (bedWarsStats?.kills_bedwars || 0) / (bedWarsStats?.deaths_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_kills_bedwars || 0) / (bedWarsStats?.eight_one_deaths_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_kills_bedwars || 0) / (bedWarsStats?.eight_two_deaths_bedwars || 0),
        four_three: (bedWarsStats?.four_three_kills_bedwars || 0) / (bedWarsStats?.four_three_deaths_bedwars || 0),
        four_four: (bedWarsStats?.four_four_kills_bedwars || 0) / (bedWarsStats?.four_four_deaths_bedwars || 0),
        two_four: (bedWarsStats?.two_four_kills_bedwars || 0) / (bedWarsStats?.two_four_deaths_bedwars || 0),
      },

      bedsBroken: {
        overAll: bedWarsStats?.beds_broken_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_beds_broken_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_beds_broken_bedwars || 0,
        four_three: bedWarsStats?.four_three_beds_broken_bedwars || 0,
        four_four: bedWarsStats?.four_four_beds_broken_bedwars || 0,
        two_four: bedWarsStats?.two_four_beds_broken_bedwars || 0,
      },
      bedsLost: {
        overAll: bedWarsStats?.beds_lost_bedwars || 0,
        eight_one: bedWarsStats?.eight_one_beds_lost_bedwars || 0,
        eight_two: bedWarsStats?.eight_two_beds_lost_bedwars || 0,
        four_three: bedWarsStats?.four_three_beds_lost_bedwars || 0,
        four_four: bedWarsStats?.four_four_beds_lost_bedwars || 0,
        two_four: bedWarsStats?.two_four_beds_lost_bedwars || 0,
      },
      bedBreakLossRatio: {
        overAll: (bedWarsStats?.beds_broken_bedwars || 0) / (bedWarsStats?.beds_lost_bedwars || 0),
        eight_one: (bedWarsStats?.eight_one_beds_broken_bedwars || 0) / (bedWarsStats?.eight_one_beds_lost_bedwars || 0),
        eight_two: (bedWarsStats?.eight_two_beds_broken_bedwars || 0) / (bedWarsStats?.eight_two_beds_lost_bedwars || 0),
        four_three: (bedWarsStats?.four_three_beds_broken_bedwars || 0) / (bedWarsStats?.four_three_beds_lost_bedwars || 0),
        four_four: (bedWarsStats?.four_four_beds_broken_bedwars || 0) / (bedWarsStats?.four_four_beds_lost_bedwars || 0),
        two_four: (bedWarsStats?.two_four_beds_broken_bedwars || 0) / (bedWarsStats?.two_four_beds_lost_bedwars || 0),
      },
    },
  };
}