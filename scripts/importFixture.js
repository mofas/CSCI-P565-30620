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
