import mongodb, { ObjectId } from "mongodb";

import {
  graphql,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean
} from "graphql";

import { userInfo } from "../cache";

import { ResultType, LeagueType, LeagueInputType } from "./model";
import { match } from "./teamMatchAlgorithm";
export const CreateLeague = {
  type: LeagueType,
  args: {
    data: { type: LeagueInputType }
  },
  resolve: async ({ req, db }, { data }, info) => {
    const { name, limit, epoc_date, formula } = data;
    var curr_epoc = Math.floor(new Date().getTime() / 1000.0);
    if (curr_epoc > epoc_date) {
      return {
        error: "Enter future date",
        success: false
      };
    }
    let date;
    try {
      date = new Date(epoc_date * 1000);
    } catch (err) {
      date = new Date();
      epoc_date = curr_epoc;
    }
    const savedData = {
      name,
      limit,
      stage: "Initial",
      accounts: [],
      draft_run: 0,
      creator: req.user._id,
      create_time: Math.floor(new Date() / 1000),
      current_pickup_accounts: null,
      draft_start_time: epoc_date,
      timeout: 2,
      lastPickTime: epoc_date,
      formula
    };

    const { value } = await db.collection("leagues").insertOne(savedData);
    return savedData;
  }
};

export const UpdateLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
    stage: { type: GraphQLString }
  },
  resolve: async ({ req, db }, { _id, stage }, info) => {
    const query = {
      _id: ObjectId(_id)
    };

    const result = await db.collection("leagues").findOne(query);
    if (result.accounts.length === result.limit && req.user) {
      const { value } = await db.collection("leagues").findOneAndUpdate(
        {
          _id: ObjectId(result._id)
        },
        {
          $set: { stage: stage }
        },
        {
          returnOriginal: false
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  }
};

export const BanUser = {
  type: ResultType,
  args: {
    _id: { type: GraphQLString },
    isBanned: { type: GraphQLBoolean }
  },
  resolve: async ({ db }, { _id, isBanned }, info) => {
    const result = await db.collection("accounts").findOneAndUpdate(
      {
        _id: ObjectId(_id)
      },
      {
        $set: { ban: isBanned }
      },
      {
        returnOriginal: false
      }
    );

    //clean up cache
    Object.keys(userInfo, key => (userInfo[key] = null));

    if (result.ok) {
      return {
        error: "",
        success: true
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false
      };
    }
  }
};

export const UpdateDraftNoLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id)
    };

    //console.log("456 draft_no:" , draft_no);
    //console.log("print " , req);
    //req.user = "test";

    const result = await db.collection("leagues").findOne(query);
    //if (result.accounts.length === result.limit && req.user) {
    let curr_epoc = Math.round(new Date().getTime() / 1000.0);
    if (result) {
      const { value } = await db.collection("leagues").findOneAndUpdate(
        {
          _id: ObjectId(result._id)
        },
        {
          $set: { draft_run: result.draft_run + 1, lastPickTime: curr_epoc }
        },
        {
          returnOriginal: false
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  }
};

export const JoinLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id)
    };

    const result = await db.collection("leagues").findOne(query);
    if (
      result.accounts.length < result.limit &&
      req.user &&
      !result.accounts.includes(req.user._id)
    ) {
      const { value } = await db.collection("leagues").findOneAndUpdate(
        {
          _id: ObjectId(result._id)
        },
        {
          $set: {
            accounts: [req.user._id, ...result.accounts],
            stage:
              result.accounts.length === result.limit - 1 ? "Draft" : "Initial"
          }
        },
        {
          returnOriginal: false
        }
      );
      return value;
    } else {
      return result;
    }
  }
};

export const DeleteLeague = {
  type: ResultType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id)
    };
    const { result } = await db.collection("leagues").remove(query);
    if (result.ok) {
      return {
        error: "",
        success: true
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false
      };
    }
  }
};

export const PoolPlayer = new GraphQLObjectType({
  name: "PoolPlayer",
  fields: {
    //league_id:{type : GraphQLString},
    //fancy_team_id: {type: GraphQLString},
    player_id: { type: GraphQLString }
  }
});

export const SelectedPlayer = {
  type: new GraphQLList(PoolPlayer),
  args: {
    league_id: { type: GraphQLString },
    player_id: { type: GraphQLString },
    account_id: { type: GraphQLString }
  },
  resolve: async ({ db }, { league_id, player_id, account_id }, info) => {
    const query = {
      league_id: league_id,
      player_id: player_id,
      account_id: account_id
    };
    console.log("39847293", league_id, player_id, account_id);
    const result = await db.collection("pool").findOne(query);
    //console.log("return data " ,JSON.stringify(result, null, 2))
    if (!result) {
      console.log("Insert the record");
      db.collection("pool").insertOne(query);
    }

    return await db
      .collection("pool")
      .find({ league_id: league_id }, { player_id: 1, _id: 0 })
      .toArray();
  }
};

export const SendMessage = {
  type: ResultType,
  args: {
    room_id: { type: new GraphQLNonNull(GraphQLString) },
    sender: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async ({ db, ws }, { room_id, sender, message }, info) => {
    const savedData = {
      room_id,
      sender,
      message,
      date_time: Math.floor(new Date().getTime() / 1000)
    };

    const { result } = await db.collection("messages").insertOne(savedData);

    //notify
    Object.keys(ws).forEach(connectId => {
      try {
        ws[connectId].send(
          JSON.stringify({
            type: "newMessage",
            ...savedData
          })
        );
      } catch (e) {
        // console.log('unable notify', e);
        ws[connectId] = null;
      }
    });

    if (result.ok) {
      return {
        error: "",
        success: true
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false
      };
    }
  }
};

export const UpdateLeagueTime = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString },
    epoc: { type: GraphQLInt }
  },
  resolve: async ({ db }, { league_id, epoc }, info) => {
    const query = {
      league_id: league_id
    };
    //console.log('39847293', league_id, player_id, fancy_team_id);
    var curr_epoc = Math.round(new Date().getTime() / 1000.0);
    if (curr_epoc > epoc) {
      return {
        error: "Enter future date",
        success: false
      };
    }
    let date = new Date(epoc * 1000);
    const result = await db.collection("leagues").findOneAndUpdate(
      {
        _id: ObjectId(league_id)
      },
      {
        $set: { draft_start_time: date }
      },
      {
        returnOriginal: false
      }
    );

    if (result.ok) {
      return {
        error: "",
        success: true
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false
      };
    }
  }
};

export const RunMatch = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString }
  },
  resolve: async ({ db }, { league_id }, info) => {
    const query = {
      league_id: league_id
    };
    const league = await db
      .collection("leagues")
      .findOne({ _id: ObjectId(league_id) });
    const schedule = await db
      .collection("schedule")
      .findOne({ league_id: league_id });
    const team1_id = schedule.first_team;
    const team2_id = schedule.second_team;
    const formula = league.formula;
    const week = schedule.week_no;
    //Have to put it in the correct format for teamMatchAlgorithm
    const team1 = {
      _id: team1_id,
      arrangement: await db
        .collection("arrangement")
        .findOne({ fancy_team_id: team1_id })
    };
    const team2 = {
      _id: team2_id,
      arrangement: await db
        .collection("arrangement")
        .findOne({ fancy_team_id: team2_id })
    };
    const result = match(league_id, week, team1, team2, formula);
    const data = {
      league_id: league_id,
      week: week,
      first_team: team1_id,
      second_team: team2_id,
      winner: result.winner,
      first_score: result.first_score,
      second_score: result.second_score
    };
    db.collection("GAME_RECORD").insertOne(data);
    console.log(result);
    return result;
    // TODO : get league data from DB using league_id
    // TODO : get schedule from DB
    // TDOO : Get teams arrangement who will play in this week from DB
    // TODO : Call match from teamMatchAlgorithm to get game record
    // TODO:  get Result and save to DB GAME_RECORD
  }
};
