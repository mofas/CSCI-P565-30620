const match = (league_id, week, team1, team2, formula) => {
  let first_score = 0;
  let second_score = 0;
  //Calc team 1 score
  for (var key in team1.arrangement) {
    let current = team1.arrangement[key];
    for (var player in current) {
      p = current[player];
      first_score =
        first_score +
        formula.tdpass * p.Passing_TDs +
        Math.floor(p.Passing_Yards / formula.passyds) +
        formula.tdrush * p.Rushing_TDs +
        Math.floor(p.Rushing_Yards / formula.rushyds) +
        formula.tdrec * p.Receiving_Yards +
        Math.floor(p.Receiving_Yards / formula.recyds) +
        formula.fgmade * p.FG_Made +
        formula.fgmissed * p.FG_Missed +
        formula.xpmade * p.Extra_Points_Made +
        formula.intthrow * p.Interceptions_Thrown +
        formula.int * p.Interceptions +
        formula.fumlost * p.Fumbles_Lost +
        formula.sack * p.Sacks +
        formula.forcedfum * p.Forced_Fumbles +
        formula.kickblock * p.Blocked_Kicks +
        formula.puntblock * p.Blocked_Punts +
        formula.tdkickret * p.Kickoff_Return_TD +
        formula.tdpuntret * p.Punt_Return_TD +
        formula.saf * p.Safeties +
        formula.tddef * p.Defensive_TD +
        formula.i20punt * p.Punting_i20 +
        Math.floor(p.Punting_Yards / formula.puntyds);
    }
  }
  //Calc Team 2 score
  for (var key in team2.arrangement) {
    let current = team2.arrangement[key];
    for (var player in current) {
      p = current[player];
      second_score =
        second_score +
        formula.tdpass * p.Passing_TDs +
        Math.floor(p.Passing_Yards / formula.passyds) +
        formula.tdrush * p.Rushing_TDs +
        Math.floor(p.Rushing_Yards / formula.rushyds) +
        formula.tdrec * p.Receiving_Yards +
        Math.floor(p.Receiving_Yards / formula.recyds) +
        formula.fgmade * p.FG_Made +
        formula.fgmissed * p.FG_Missed +
        formula.xpmade * p.Extra_Points_Made +
        formula.intthrow * p.Interceptions_Thrown +
        formula.int * p.Interceptions +
        formula.fumlost * p.Fumbles_Lost +
        formula.sack * p.Sacks +
        formula.forcedfum * p.Forced_Fumbles +
        formula.kickblock * p.Blocked_Kicks +
        formula.puntblock * p.Blocked_Punts +
        formula.tdkickret * p.Kickoff_Return_TD +
        formula.tdpuntret * p.Punt_Return_TD +
        formula.saf * p.Safeties +
        formula.tddef * p.Defensive_TD +
        formula.i20punt * p.Punting_i20 +
        Math.floor(p.Punting_Yards / formula.puntyds);
    }
  }
  let winner = first_score > second_score ? 0 : 1;

  return {
    league_id,
    week,
    first_team: team1._id.toString(),
    second_team: team2._id.toString(),
    winner,
    first_score,
    second_score
  };
};

const team1 = {
  _id: "5a0892cf1391c723e4f2df23",
  name: "test team",
  account: {
    _id: "59e988fe76539f281279d241",
    email: "mofas223@gmail.com",
    role: "admin",
    status: "0",
    ban: false
  },
  league: {
    name: "My League"
  },
  arrangement: {
    position_qb: [
      {
        Name: "A. Rodgers",
        Position: "QB",
        Passing_Yards: 1385,
        Rushing_Yards: 83,
        Receiving_Yards: 0,
        Passing_TDs: 13,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 1,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_rb: [
      {
        Name: "K. Hunt",
        Position: "RB",
        Passing_Yards: 0,
        Rushing_Yards: 630,
        Receiving_Yards: 255,
        Passing_TDs: 0,
        Rushing_TDs: 4,
        Receiving_TD: 2,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 1,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_wr: [
      {
        Name: "A. Brown",
        Position: "WR",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 700,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 2,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "D. Hopkins",
        Position: "WR",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 382,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 6,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_te: [],
    position_k: [
      {
        Name: "G. Zuerlein",
        Position: "K",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 17,
        FG_Missed: 1,
        Extra_Points_Made: 18,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "D. Hopkins",
        Position: "K",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 9,
        FG_Missed: 2,
        Extra_Points_Made: 12,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_defense: [
      {
        Name: "D. Lawrence",
        Position: "DE",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 2,
        Sacks: 9,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "J. Agnew",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 2,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "J. McCourty",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 3,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 2,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "Y. Ngakoue",
        Position: "DE",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 3,
        Sacks: 4,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "M. Hyde",
        Position: "SS",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 4,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "A. Brown",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 1,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_p: []
  }
};
const team2 = {
  _id: "5a0892cf1391c723e4f2df23",
  name: "test team",
  account: {
    _id: "59e988fe76539f281279d241",
    email: "mofas223@gmail.com",
    role: "admin",
    status: "0",
    ban: false
  },
  league: {
    name: "My League"
  },
  arrangement: {
    position_qb: [
      {
        Name: "A. Rodgers",
        Position: "QB",
        Passing_Yards: 1385,
        Rushing_Yards: 83,
        Receiving_Yards: 0,
        Passing_TDs: 13,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 1,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_rb: [
      {
        Name: "K. Hunt",
        Position: "RB",
        Passing_Yards: 0,
        Rushing_Yards: 630,
        Receiving_Yards: 255,
        Passing_TDs: 0,
        Rushing_TDs: 4,
        Receiving_TD: 2,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 1,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_wr: [
      {
        Name: "A. Brown",
        Position: "WR",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 700,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 2,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "D. Hopkins",
        Position: "WR",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 382,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 6,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_te: [],
    position_k: [
      {
        Name: "G. Zuerlein",
        Position: "K",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 17,
        FG_Missed: 1,
        Extra_Points_Made: 18,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "D. Hopkins",
        Position: "K",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 9,
        FG_Missed: 2,
        Extra_Points_Made: 12,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_defense: [
      {
        Name: "D. Lawrence",
        Position: "DE",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 2,
        Sacks: 9,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "J. Agnew",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 2,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "J. McCourty",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 3,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 2,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "Y. Ngakoue",
        Position: "DE",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 0,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 3,
        Sacks: 4,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "M. Hyde",
        Position: "SS",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 4,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      },
      {
        Name: "A. Brown",
        Position: "CB",
        Passing_Yards: 0,
        Rushing_Yards: 0,
        Receiving_Yards: 0,
        Passing_TDs: 0,
        Rushing_TDs: 0,
        Receiving_TD: 0,
        FG_Made: 0,
        FG_Missed: 0,
        Extra_Points_Made: 0,
        Interceptions: 1,
        Fumbles_Lost: 0,
        Kickoff_Return_TD: 0,
        Interceptions_Thrown: 0,
        Forced_Fumbles: 0,
        Sacks: 0,
        Blocked_Kicks: 0,
        Blocked_Punts: 0,
        Safeties: 0,
        Punt_Return_TD: 0,
        Defensive_TD: 0,
        Punting_Yards: 0,
        Punting_i20: 0
      }
    ],
    position_p: []
  }
};
const formula = {
  tdpass: 4,
  passyds: 25,
  tdrush: 6,
  rushyds: 10,
  tdrec: 6,
  recyds: 10,
  passyds: 5,
  fgmade: 3,
  fgmissed: -1,
  xpmade: 1,
  intthrow: -2,
  int: 2,
  fumlost: -2,
  sack: 1,
  forcedfum: 2,
  kickblock: 2,
  puntblock: 2,
  tdkickret: 6,
  saf: 2,
  tdpuntret: 6,
  tddef: 6,
  i20punt: 1,
  puntyds: 50
};

//const result = match("123123123", 1, team1, team2, formula);

//console.log(result);

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
