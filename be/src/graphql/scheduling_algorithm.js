//var file = module.exports = {

var arr = [];
var data = [];
var n = 0; // Number of teams in tournament
var weeklyMatch = [];
var total_no_weeks = 15;
var ret_object = [];

function prepareInputs(weeks, team_array) {
  n = team_array.length;
  total_no_weeks = weeks;
  data = team_array;
  for (let i = 0; i < n; i++) {
    arr[i] = new Array(n);
  }
  for (let i = 0; i < n; i++) {
    weeklyMatch[i] = [];
  }
}

function generateMatch() {
  for (let i = 0; i < n; i++) {
    let val = i + 1;
    for (let j = 0; j < n - 1; j++) {
      if (val == n) val = 1;
      if (i == j) {
        arr[i][j] = 0;
        arr[n - 1][i] = val;
      } else {
        arr[j][i] = val;
      }
      val++;
    }
  }
  arr[n - 1][n - 1] = 0;
}

function matchingTeam() {
  //console.log("In matchingTeam function " + n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      //let x = i+1; let y = j+1;
      var hm = {};
      hm["first_team"] = data[i];
      hm["second_team"] = data[j];
      hm["week_no"] = arr[i][j];
      weeklyMatch[arr[i][j]].push(hm);
    }
  }
}

export default function prepareScheduleObject(weeks, team_array) {
  prepareInputs(weeks, team_array);
  generateMatch();
  matchingTeam();
  //console.log(JSON.stringify(weeklyMatch, null, 2))
  var week_number = 1;
  const ret = [];
  while (week_number <= total_no_weeks) {
    for (let i = 1; i < n; i++) {
      if (week_number <= total_no_weeks) {
        let week_match = weeklyMatch[i];
        //console.log('week_match', week_match)
        //console.log(" 9890 Weekno ", week_number );
        for (let j = 0; j < weeklyMatch[i].length; j++) {
          const match = Object.assign({}, weeklyMatch[i][j]);

          match["week_no"] = week_number;

          //console.log(match);
          ret.push(match);
        }
        week_number++;
      } else {
        break;
      }
    }
  }
  return ret;
}

//generateMatch();
//matchingTeam();
// var s = ["T1", "T2", "T3", "T4", "T5", "T6"];
// var ret = prepareScheduleObject(10, s);
// console.log("Final query result ...");
// console.log(JSON.stringify(ret, null, 2));

//console.log("length " + ret_object.length);
//showWeeklyMatch();

// function showWeeklyMatch(){
//  for(let i=0; i<ret.length; i++){
//      console.log(ret[i]);
//  }
// }
