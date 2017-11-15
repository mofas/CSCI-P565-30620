const csv = require('csvtojson');
const mongodb = require('mongodb');

const csvFilePath = '../dataset/nfl_stats.csv';

const dbUrl = 'mongodb://localhost:27017/local';

const readData = filePath => {
  return new Promise((resolve, reject) => {
    let ret = [];
    csv()
      .fromFile(filePath)
      .on('json', data => {
        data['Passing_Yards'] = parseInt(data['Passing_Yards'], 10);
        data['Rushing_Yards'] = parseInt(data['Rushing_Yards'], 10);
        data['Receiving_Yards'] = parseInt(data['Receiving_Yards'], 10);
        data['Passing_TDs'] = parseInt(data['Passing_TDs'], 10);
        data['Rushing_TDs'] = parseInt(data['Rushing_TDs'], 10);
        data['Receiving_TD'] = parseInt(data['Receiving_TD'], 10);
        data['FG_Made'] = parseInt(data['FG_Made'], 10);
        data['FG_Missed'] = parseInt(data['FG_Missed'], 10);
        data['Extra_Points_Made'] = parseInt(data['Extra_Points_Made'], 10);
        data['Interceptions'] = parseInt(data['Interceptions'], 10);
        data['Fumbles_Lost'] = parseInt(data['Fumbles_Lost'], 10);
        data['Forced_Fumbles'] = parseInt(data['Forced_Fumbles'], 10);
        data['Interceptions_Thrown'] = parseInt(
          data['Interceptions_Thrown'],
          10
        );
        data['Sacks'] = parseInt(data['Sacks'], 10);
        data['Blocked_Kicks'] = parseInt(data['Blocked_Kicks'], 10);
        data['Blocked_Punts'] = parseInt(data['Blocked_Punts'], 10);
        data['Safeties'] = parseInt(data['Safeties'], 10);
        data['Kickoff_Return_TD'] = parseInt(data['Kickoff_Return_TD'], 10);
        data['Punt_Return_TD'] = parseInt(data['Punt_Return_TD'], 10);
        data['Defensive_TD'] = parseInt(data['Defensive_TD'], 10);
        data['Punting_i20'] = parseInt(data['Punting_i20'], 10);
        data['Punting_Yards'] = parseInt(data['Punting_Yards'], 10);
        //Current week stats
        data['Passing_Yards_curr'] = parseInt(data['Passing_Yards'], 10);
        data['Rushing_Yards_curr'] = parseInt(data['Rushing_Yards'], 10);
        data['Receiving_Yards_curr'] = parseInt(data['Receiving_Yards'], 10);
        data['Passing_TDs_curr'] = parseInt(data['Passing_TDs'], 10);
        data['Rushing_TDs_curr'] = parseInt(data['Rushing_TDs'], 10);
        data['Receiving_TD_curr'] = parseInt(data['Receiving_TD'], 10);
        data['FG_Made_curr'] = parseInt(data['FG_Made'], 10);
        data['FG_Missed_curr'] = parseInt(data['FG_Missed'], 10);
        data['Extra_Points_Made_curr'] = parseInt(
          data['Extra_Points_Made'],
          10
        );
        data['Interceptions_curr'] = parseInt(data['Interceptions'], 10);
        data['Fumbles_Lost_curr'] = parseInt(data['Fumbles_Lost'], 10);
        data['Forced_Fumbles_curr'] = parseInt(data['Forced_Fumbles'], 10);
        data['Interceptions_Thrown_curr'] = parseInt(
          data['Interceptions_Thrown'],
          10
        );
        data['Sacks_curr'] = parseInt(data['Sacks'], 10);
        data['Blocked_Kicks_curr'] = parseInt(data['Blocked_Kicks'], 10);
        data['Blocked_Punts_curr'] = parseInt(data['Blocked_Punts'], 10);
        data['Safeties_curr'] = parseInt(data['Safeties'], 10);
        data['Kickoff_Return_TD_curr'] = parseInt(
          data['Kickoff_Return_TD'],
          10
        );
        data['Punt_Return_TD_curr'] = parseInt(data['Punt_Return_TD'], 10);
        data['Defensive_TD_curr'] = parseInt(data['Defensive_TD'], 10);
        data['Punting_i20_curr'] = parseInt(data['Punting_i20'], 10);
        data['Punting_Yards_curr'] = parseInt(data['Punting_Yards'], 10);
        data['Rank'] = parseInt(data['Rank'], 10);
        ret.push(data);
      })
      .on('done', error => {
        console.log('end');
        resolve(ret);
      });
  });
};

const writeToDB = data => {
  return new Promise((resolve, reject) => {
    mongodb.MongoClient.connect(dbUrl, {}).then(db => {
      const playersCol = db.collection('players');
      const bulk = playersCol.initializeOrderedBulkOp();
      data.forEach(d => {
        bulk.insert(d);
      });
      bulk.execute((err, result) => {
        resolve({ err, result });
      });
      db.close();
    });
  });
};

readData(csvFilePath)
  .then(res => {
    return writeToDB(res);
  })
  .then(res => {
    console.log('the result is ...' + res);
  });
