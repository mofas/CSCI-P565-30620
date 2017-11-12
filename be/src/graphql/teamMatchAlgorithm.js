// formula: {
//   td_passway_weight: 4,
// }

// TODO
const match = (league_id, week, team1, team2, formula) => {
  //TODO calculate
  let first_score = 0;
  let second_score = 0;
  let winnner = first_score > second_score ? 0 : 1;

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
