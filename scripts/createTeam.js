const mongodb = require('mongodb');

const dbUrl = 'mongodb://localhost:27017/local';

// This script will insert the player data to pool with league_id and account_id

const LEAGUE_ID = '5a089d4a3d16fb4788b90dfa';
const ACCOUNT_EMAIL = 'jgpark@umail.iu.edu';
const PLAYER_NAME_LIST = [
  'A. Rodgers', //QB
  'K. Hunt', //RB
  'A. Brown', //WR
  'D. Hopkins', //WR
  'T. Kelce', // TE
  'G. Zuerlein', // K
  "P. O'Donnell", //P
  //Defense
  'D. Lawrence',
  'J. Agnew',
  'Y. Ngakoue',
  'J. McCourty',
  'M. Hyde',
];

const connectDB = async () => {
  return await mongodb.MongoClient.connect(dbUrl, {});
};

const closeConnection = async db => {
  return await db.close();
};

const readAccount = async db => {
  return await db.collection('accounts').findOne({ email: ACCOUNT_EMAIL });
};

const readPlayers = async db => {
  return await db
    .collection('players')
    .find({ Name: { $in: PLAYER_NAME_LIST } })
    .toArray();
};

const insertToPool = db => async ({ league_id, account_id, players }) => {
  const data = players.map(d => {
    return {
      player_id: d._id.toString(),
      league_id,
      account_id,
    };
  });

  await db.collection('pool').remove({
    league_id,
    account_id,
  });
  return await db.collection('pool').insertMany(data);
};

const createFantasyTeam = db => async ({ league_id, account_id, name }) => {
  await db.collection('fantasy_team').remove({
    league_id,
    account_id,
  });

  const { insertedId } = await db.collection('fantasy_team').insertOne({
    account_id,
    league_id,
    name,
    win: 0,
    lose: 0,
  });

  return insertedId.toString();
};

//TODO: INSERT
// {
//   fantasy_team_id: "xxxx",
//   position_qb_0
//   position_rb_0
//   position_wr_0
//   position_wr_1
//   position_te_0
//   position_k_0
//   position_p_0
//   position_defense_0
//   position_defense_1
//   position_defense_2
//   position_defense_3
//   position_defense_4
// }
const insertToArrangement = db => async ({ fantasy_team_id, players }) => {
  const data = players.reduce(
    (acc, d) => {
      const position = d.Position;
      if (position === 'QB') {
        acc.position_qb_0 = d._id.toString();
      } else if (position === 'RB') {
        acc.position_rb_0 = d._id.toString();
      } else if (position === 'WR') {
        if (!acc.position_wr_0) {
          acc.position_wr_0 = d._id.toString();
        } else {
          acc.position_wr_1 = d._id.toString();
        }
      } else if (position === 'TE') {
        acc.position_te_0 = d._id.toString();
      } else if (position === 'K') {
        acc.position_k_0 = d._id.toString();
      } else if (position === 'P') {
        acc.position_p_0 = d._id.toString();
      } else {
        if (!acc.position_defense_0) {
          acc.position_defense_0 = d._id.toString();
        } else if (!acc.position_defense_1) {
          acc.position_defense_1 = d._id.toString();
        } else if (!acc.position_defense_2) {
          acc.position_defense_2 = d._id.toString();
        } else if (!acc.position_defense_3) {
          acc.position_defense_3 = d._id.toString();
        } else if (!acc.position_defense_4) {
          acc.position_defense_4 = d._id.toString();
        }
      }

      return acc;
    },
    {
      fantasy_team_id,
      position_qb_0: null,
      position_rb_0: null,
      position_wr_0: null,
      position_wr_1: null,
      position_te_0: null,
      position_k_0: null,
      position_p_0: null,
      position_defense_0: null,
      position_defense_1: null,
      position_defense_2: null,
      position_defense_3: null,
      position_defense_4: null,
    }
  );

  console.log(data);

  await db.collection('arrangement').remove({
    fantasy_team_id,
  });
  return await db.collection('arrangement').insertOne(data);
};

connectDB().then(async db => {
  const userData = await readAccount(db);
  // console.log(userData);

  const players = await readPlayers(db);
  // console.log(players);

  const league_id = LEAGUE_ID;
  const account_id = userData._id.toString();

  await insertToPool(db)({
    league_id,
    account_id,
    players,
  });

  const fantasy_team_id = await createFantasyTeam(db)({
    league_id,
    account_id,
    name: 'test team',
  });

  await insertToArrangement(db)({
    fantasy_team_id,
    players,
  });

  console.log('fantasy_team_id is ' + fantasy_team_id);

  closeConnection(db);
});
