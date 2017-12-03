export const match = (league_id, week, team1, team2, formula) => {
  let first_score = 0;
  let second_score = 0;
  //Calc team 1 score
  for (var key in team1.arrangement) {
    let p = team1.arrangement[key];
    if (key != '_id' && key != 'fantasy_team_id') {
      first_score =
        first_score +
        formula.tdpass * p.Passing_TDs_curr +
        Math.floor(p.Passing_Yards_curr / formula.passyds) +
        formula.tdrush * p.Rushing_TDs_curr +
        Math.floor(p.Rushing_Yards_curr / formula.rushyds) +
        formula.tdrec * p.Receiving_Yards_curr +
        Math.floor(p.Receiving_Yards_curr / formula.recyds) +
        formula.fgmade * p.FG_Made_curr +
        formula.fgmissed * p.FG_Missed_curr +
        formula.xpmade * p.Extra_Points_Made_curr +
        formula.intthrow * p.Interceptions_Thrown_curr +
        formula.int * p.Interceptions_curr +
        formula.fumlost * p.Fumbles_Lost_curr +
        formula.sack * p.Sacks_curr +
        formula.forcedfum * p.Forced_Fumbles_curr +
        formula.kickblock * p.Blocked_Kicks_curr +
        formula.puntblock * p.Blocked_Punts_curr +
        formula.tdkickret * p.Kickoff_Return_TD_curr +
        formula.tdpuntret * p.Punt_Return_TD_curr +
        formula.saf * p.Safeties_curr +
        formula.tddef * p.Defensive_TD_curr +
        formula.i20punt * p.Punting_i20_curr +
        Math.floor(p.Punting_Yards_curr / formula.puntyds);
    }
  }
  //Calc Team 2 score
  for (var key in team2.arrangement) {
    let p = team2.arrangement[key];
    if (key != '_id' && key != 'fantasy_team_id') {
      second_score =
        second_score +
        formula.tdpass * p.Passing_TDs_curr +
        Math.floor(p.Passing_Yards_curr / formula.passyds) +
        formula.tdrush * p.Rushing_TDs_curr +
        Math.floor(p.Rushing_Yards_curr / formula.rushyds) +
        formula.tdrec * p.Receiving_Yards_curr +
        Math.floor(p.Receiving_Yards_curr / formula.recyds) +
        formula.fgmade * p.FG_Made_curr +
        formula.fgmissed * p.FG_Missed_curr +
        formula.xpmade * p.Extra_Points_Made_curr +
        formula.intthrow * p.Interceptions_Thrown_curr +
        formula.int * p.Interceptions_curr +
        formula.fumlost * p.Fumbles_Lost_curr +
        formula.sack * p.Sacks_curr +
        formula.forcedfum * p.Forced_Fumbles_curr +
        formula.kickblock * p.Blocked_Kicks_curr +
        formula.puntblock * p.Blocked_Punts_curr +
        formula.tdkickret * p.Kickoff_Return_TD_curr +
        formula.tdpuntret * p.Punt_Return_TD_curr +
        formula.saf * p.Safeties_curr +
        formula.tddef * p.Defensive_TD_curr +
        formula.i20punt * p.Punting_i20_curr +
        Math.floor(p.Punting_Yards_curr / formula.puntyds);
    }
  }
  let winner = first_score > second_score ? 0 : 1;
  if (first_score === second_score) {
    winner = Math.floor(Math.random() * 2);
  }
  return {
    league_id,
    week,
    first_team: team1._id.toString(),
    second_team: team2._id.toString(),
    winner,
    first_score,
    second_score,
  };
};

// Return Record
// {
//   league_id: "xxx",
//   week: 1,
//   first_team: "xxxxx",
//   second_team: "xxxxxx",
//   winner: 0, // 0 mean first, 1 mean second
//   first_score: 44,
//   second_score: 23,
// }
