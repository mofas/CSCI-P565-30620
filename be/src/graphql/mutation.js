import mongodb, { ObjectId } from 'mongodb';
import prepareScheduleObject from './scheduling_algorithm';

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
  GraphQLBoolean,
} from 'graphql';

import { userInfo } from '../cache';

import {
  ResultType,
  LeagueType,
  LeagueInputType,
  ScheduleInputType,
} from './model';
import { match } from './teamMatchAlgorithm';
import { QueryLeague } from './query';

export const CreateLeague = {
  type: LeagueType,
  args: {
    data: { type: LeagueInputType },
  },
  resolve: async ({ req, db }, { data }, info) => {
    const { name, limit, epoc_date, formula } = data;
    var curr_epoc = Math.floor(new Date().getTime() / 1000.0);
    if (curr_epoc > epoc_date) {
      return {
        error: 'Enter future date',
        success: false,
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
      stage: 'Initial',
      accounts: [],
      draft_run: 0,
      creator: req.user._id,
      create_time: Math.floor(new Date() / 1000),
      current_pickup_accounts: null,
      draft_start_time: epoc_date,
      timeout: 2,
      lastPickTime: epoc_date,
      formula,
      gameWeek: 1,
    };

    const { value } = await db.collection('leagues').insertOne(savedData);
    return savedData;
  },
};

export const UpdateLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
    stage: { type: GraphQLString },
  },
  resolve: async ({ req, db }, { _id, stage }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    const result = await db.collection('leagues').findOne(query);
    if (result.accounts.length === result.limit && req.user) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: { stage: stage },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  },
};

export const BanUser = {
  type: ResultType,
  args: {
    _id: { type: GraphQLString },
    isBanned: { type: GraphQLBoolean },
  },
  resolve: async ({ db }, { _id, isBanned }, info) => {
    const result = await db.collection('accounts').findOneAndUpdate(
      {
        _id: ObjectId(_id),
      },
      {
        $set: { ban: isBanned },
      },
      {
        returnOriginal: false,
      }
    );

    //clean up cache
    Object.keys(userInfo, key => (userInfo[key] = null));

    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

export const UpdateDraftNoLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    //console.log("456 draft_no:" , draft_no);
    //console.log("print " , req);
    //req.user = "test";

    const result = await db.collection('leagues').findOne(query);
    //if (result.accounts.length === result.limit && req.user) {
    let curr_epoc = Math.round(new Date().getTime() / 1000.0);
    if (result) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: { draft_run: result.draft_run + 1, lastPickTime: curr_epoc },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  },
};

export const JoinLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    const result = await db.collection('leagues').findOne(query);
    if (
      result.accounts.length < result.limit &&
      req.user &&
      !result.accounts.includes(req.user._id)
    ) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: {
            accounts: [req.user._id, ...result.accounts],
            stage:
              result.accounts.length === result.limit - 1 ? 'Draft' : 'Initial',
          },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      return result;
    }
  },
};

export const DeleteLeague = {
  type: ResultType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };
    const { result } = await db.collection('leagues').remove(query);
    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

/**
export const PoolPlayer = new GraphQLObjectType({
  name: 'PoolPlayer',
  fields: {
    //league_id:{type : GraphQLString},
    //fantasy_team_id: {type: GraphQLString},
    player_id: { type: GraphQLString },
  },
});
**/

export const SelectedPlayer = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString },
    player_id: { type: GraphQLString },
    account_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { league_id, player_id, account_id }, info) => {
    const query = {
      league_id: league_id,
      player_id: player_id,
      account_id: account_id,
    };
    // console.log("39847293", league_id, player_id, account_id);
    const result = await db.collection('pool').findOne(query);
    if (!result) {
      console.log('Insert the record');
      const insertRec = {
        league_id: league_id,
        player_id: player_id,
        account_id: account_id,
      };
      const { result } = await db.collection('pool').insertOne(insertRec);
      console.log(result);
      console.log(result.ok);
      if (result.ok) {
        return {
          error: '',
          success: true,
        };
      } else {
        return {
          error: JSON.stringify(result),
          success: false,
        };
      }
    } else {
      console.log(
        'Player already exist---------------->',
        league_id,
        player_id,
        account_id
      );
      return {
        error: 'Player already exist',
        success: false,
      };
    }

    // return await db
    //   .collection('pool')
    //   .find({ league_id: league_id }, { player_id: 1, _id: 0 })
    //   .toArray();
  },
};

export const ReleasePlayer = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString },
    player_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { league_id, player_id }, info) => {
    const update = {
      league_id: league_id,
      player_id: player_id,
    };

    const { result } = await db.collection('pool').remove(update);

    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

export const SendMessage = {
  type: ResultType,
  args: {
    room_id: { type: new GraphQLNonNull(GraphQLString) },
    sender: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async ({ db, ws }, { room_id, sender, message }, info) => {
    const savedData = {
      room_id,
      sender,
      message,
      date_time: Math.floor(new Date().getTime() / 1000),
    };

    const { result } = await db.collection('messages').insertOne(savedData);

    //notify
    Object.keys(ws).forEach(connectId => {
      try {
        ws[connectId].send(
          JSON.stringify({
            type: 'newMessage',
            ...savedData,
          })
        );
      } catch (e) {
        // console.log('unable notify', e);
        ws[connectId] = null;
      }
    });

    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

export const UpdateLeagueTime = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString },
    epoc: { type: GraphQLInt },
  },
  resolve: async ({ db }, { league_id, epoc }, info) => {
    const query = {
      league_id: league_id,
    };
    //console.log('39847293', league_id, player_id, fantasy_team_id);
    var curr_epoc = Math.round(new Date().getTime() / 1000.0);
    if (curr_epoc > epoc) {
      return {
        error: 'Enter future date',
        success: false,
      };
    }
    let date = new Date(epoc * 1000);
    const result = await db.collection('leagues').findOneAndUpdate(
      {
        _id: ObjectId(league_id),
      },
      {
        $set: { draft_start_time: date },
      },
      {
        returnOriginal: false,
      }
    );

    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

export const RunMatch = {
  type: ResultType,
  args: {
    league_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { league_id }, info) => {
    const query = {
      league_id: league_id,
    };
    const league = await db
      .collection('leagues')
      .findOne({ _id: ObjectId(league_id) });
    const formula = league.formula;
    const week = league.gameWeek;
    const schedule = await db
      .collection('schedule')
      .find({ league_id: league_id, week_no: week })
      .toArray();
    var result;
    for (var game in schedule) {
      const team1_id = schedule[game].first_team;
      const team2_id = schedule[game].second_team;
      //Have to put it in the correct format for teamMatchAlgorithm
      const team1 = {
        _id: team1_id,
        arrangement: await db
          .collection('arrangement')
          .findOne({ fancy_team_id: team1_id }),
      };
      const team2 = {
        _id: team2_id,
        arrangement: await db
          .collection('arrangement')
          .findOne({ fancy_team_id: team2_id }),
      };
      result = match(league_id, week, team1, team2, formula);
      const data = {
        league_id: league_id,
        week: week,
        first_team: team1_id,
        second_team: team2_id,
        winner: result.winner,
        first_score: result.first_score,
        second_score: result.second_score,
      };
      console.log(data);
      if (result.winner === 0) {
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: team1_id }, { $inc: { win: 1 } });
      } else {
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: team2_id }, { $inc: { win: 1 } });
      }
      db.collection('GAME_RECORD').insertOne(data);
    }
    return result;
  },
};

export const SetSchedule = {
  type: ResultType,
  args: {
    data: { type: ScheduleInputType },
    // league_id: { type: GraphQLString },
    // account_ids: { type: new GraphQLList(GraphQLString) },
    // weeks: { type: GraphQLInt }
  },
  resolve: async ({ db }, { data }, info) => {
    const { league_id, account_ids, weeks } = data;
    const r = await prepareScheduleObject(weeks, account_ids);

    r.map(d => {
      return (d.league_id = league_id);
    });

    const result = await db.collection('schedule').insertMany(r);

    if (!result) {
      return {
        error: 'Error while inserting in schedule collection',
        success: false,
      };
    }
    return {
      error: '',
      success: true,
    };
  },
};

export const CreateFantasyTeam = {
  type: ResultType,
  args: {
    account_id: { type: new GraphQLNonNull(GraphQLString) },
    league_id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async ({ db, ws }, { account_id, league_id }, info) => {
    await db.collection('fantasy_team').remove({
      account_id,
      league_id,
    });

    const res = await db.collection('fantasy_team').insert({
      account_id,
      league_id,
      name: '',
      wins: 0,
      lose: 0,
    });

    if (res.result.ok) {
      const fantasy_team_id = res.insertedIds[0];
      const data = {
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
      };
      await db.collection('arrangement').insertOne(data);
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};

export const UpdateTeamArrangement = {
  type: ResultType,
  args: {
    fantasy_team_id: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: new GraphQLNonNull(GraphQLString) },
    player_id: { type: GraphQLString },
  },
  resolve: async (
    { db, ws },
    { fantasy_team_id, position, index, player_id },
    info
  ) => {
    const { result } = await db.collection('arrangement').update(
      {
        fantasy_team_id: fantasy_team_id,
      },
      {
        $set: {
          [`${position}`]: player_id === '' ? null : player_id,
        },
      }
    );

    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};
