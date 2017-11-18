const mongodb = require("mongodb");

const dbUrl = "mongodb://localhost:27017/local";

// This script will insert the player data to pool with league_id and account_id

const LEAGUE_ID = "5a089d4a3d16fb4788b90dfa";
const ACCOUNT_EMAIL = "jgpark@gmail.com";
const PLAYER_NAME_LIST = [
  "A. Rodgers", //QB
  "K. Hunt", //RB
  "A. Brown", //WR
  "D. Hopkins", //WR
  // '', // we don't have TE yet
  "G. Zuerlein", // K

  //Defense
  "D. Lawrence",
  "J. Agnew",
  "Y. Ngakoue",
  "J. McCourty",
  "M. Hyde"
];

const connectDB = async () => {
  return await mongodb.MongoClient.connect(dbUrl, {});
};

const closeConnection = async db => {
  return await db.close();
};

const readAccount = async db => {
  return await db.collection("accounts").findOne({ email: ACCOUNT_EMAIL });
};

const readPlayers = async db => {
  return await db
    .collection("players")
    .find({ Name: { $in: PLAYER_NAME_LIST } })
    .toArray();
};

const insertToPool = db => async ({ league_id, account_id, players }) => {
  const data = players.map(d => {
    return {
      player_id: d._id.toString(),
      league_id,
      account_id
    };
  });

  await db.collection("pool").remove({
    league_id,
    account_id
  });
  return await db.collection("pool").insertMany(data);
};

const createFantasyTeam = db => async ({ league_id, account_id, name }) => {
  await db.collection("fantasy_team").remove({
    league_id,
    account_id
  });

  const { insertedId } = await db.collection("fantasy_team").insertOne({
    account_id,
    league_id,
    name,
    win: 0,
    lose: 0
  });

  return insertedId.toString();
};

//TODO: INSERT
// {
//   fantasy_team_id: "xxxx",
//   position_qb: [], // 1
//   position_rb: [], // 1
//   position_wr: [], // 2
//   position_te: [], // 1
//   position_k: [], // 1
//   position_defense: [], // 5
//   position_p: [], // 1
// }
const insertToArrangement = db => async ({ fantasy_team_id, players }) => {
  const data = players.reduce(
    (acc, d) => {
      const position = d.Position;
      console.log(d.Name, d.Position);
      if (position === "QB") {
        acc.position_qb.push(d._id.toString());
      } else if (position === "RB") {
        acc.position_rb.push(d._id.toString());
      } else if (position === "WR") {
        acc.position_wr.push(d._id.toString());
      } else if (position === "TE") {
        acc.position_te.push(d._id.toString());
      } else if (position === "K") {
        acc.position_k.push(d._id.toString());
      } else if (position === "P") {
        acc.position_p.push(d._id.toString());
      } else {
        // CB, DB, DT, NT, DE, LB, OLB, ILB, MLB, FS, SS, DEF, SAF, DL
        acc.position_defense.push(d._id.toString());
      }

      return acc;
    },
    {
      fantasy_team_id,
      position_qb: [], // 1
      position_rb: [], // 1
      position_wr: [], // 2
      position_te: [], // 1
      position_k: [], // 1
      position_defense: [], // 5
      position_p: [] // 1
    }
  );

  await db.collection("arrangement").remove({
    fantasy_team_id
  });
  return await db.collection("arrangement").insertOne(data);
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
    players
  });

  const fantasy_team_id = await createFantasyTeam(db)({
    league_id,
    account_id,
    name: "test team"
  });

  await insertToArrangement(db)({
    fantasy_team_id,
    players
  });

  console.log("fantasy_team_id is " + fantasy_team_id);

  closeConnection(db);
});
