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
  GameRecordType,
} from './model';
import { match } from './teamMatchAlgorithm';
import { QueryLeague } from './query';

import {
  getLoader,
  playerLoaderGenerator,
  fantasyTeamByAccountsLoaderGenerator,
} from './dataLoader';

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
          $set: {
            stage: stage,
          },
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

    const result = await db.collection('leagues').findOne(query);

    if (result) {
      let currentTime = Math.round(new Date().getTime() / 1000); //in sec
      const lastPickTime = result.lastPickTime;
      const timeout = result.timeout;

      const elapsedTime = currentTime - lastPickTime;
      const elapsedDraft = Math.floor(elapsedTime / (timeout * 60));

      const newDraftRun = result.draft_run + elapsedDraft;
      const newLastPickTime = lastPickTime + elapsedDraft * timeout * 60;

      if (elapsedDraft > 0) {
        const { value } = await db.collection('leagues').findOneAndUpdate(
          {
            _id: ObjectId(result._id),
          },
          {
            $set: { draft_run: newDraftRun, lastPickTime: newLastPickTime },
          },
          {
            returnOriginal: false,
          }
        );
        return value;
      }
      return result;
    }
    return null;
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

    const account_id = req.user._id;
    const league_id = _id;
    const result = await db.collection('leagues').findOne(query);
    if (
      result.accounts.length < result.limit &&
      req.user &&
      !result.accounts.includes(account_id)
    ) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: {
            accounts: [req.user._id, ...result.accounts],
            lastPickTime: Math.floor(new Date().getTime() / 1000.0),
            stage:
              result.accounts.length === result.limit - 1 ? 'Draft' : 'Initial',
          },
        },
        {
          returnOriginal: false,
        }
      );

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

      const fantasy_team_id = res.insertedIds[0].toString();
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
  resolve: async ({ db, ws }, { league_id, player_id, account_id }, info) => {
    const query = {
      league_id: league_id,
      player_id: player_id,
      account_id: account_id,
    };
    // console.log("39847293", league_id, player_id, account_id);
    const result = await db.collection('pool').findOne(query);
    if (!result) {
      const insertRec = {
        league_id: league_id,
        player_id: player_id,
        account_id: account_id,
      };
      const { result } = await db.collection('pool').insertOne(insertRec);

      const updateRes = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(league_id),
        },
        {
          $set: {
            lastPickTime: Math.round(new Date().getTime() / 1000),
          },
          $inc: {
            draft_run: 1,
          },
        }
      );

      if (result.ok) {
        Object.keys(ws).forEach(connectId => {
          try {
            ws[connectId].send(
              JSON.stringify({
                type: 'selectedPlayer',
                league_id: league_id,
                account_id: account_id,
              })
            );
          } catch (e) {
            ws[connectId] = null;
          }
        });

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
      return {
        error: 'Player already exist',
        success: false,
      };
    }
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

const positionKey = [
  'position_qb_0',
  'position_rb_0',
  'position_wr_0',
  'position_wr_1',
  'position_te_0',
  'position_k_0',
  'position_p_0',
  'position_defense_0',
  'position_defense_1',
  'position_defense_2',
  'position_defense_3',
  'position_defense_4',
];

const defaultPlayerStat = stats => {
  return {
    Passing_Yards_curr: stats.Passing_Yards_curr || 0,
    Rushing_Yards_curr: stats.Rushing_Yards_curr || 0,
    Receiving_Yards_curr: stats.Receiving_Yards_curr || 0,
    Passing_TDs_curr: stats.Passing_TDs_curr || 0,
    Rushing_TDs_curr: stats.Rushing_TDs_curr || 0,
    Receiving_TD_curr: stats.Receiving_TD_curr || 0,
    FG_Made_curr: stats.FG_Made_curr || 0,
    FG_Missed_curr: stats.FG_Missed_curr || 0,
    Extra_Points_Made_curr: stats.Extra_Points_Made_curr || 0,
    Interceptions_curr: stats.Interceptions_curr || 0,
    Fumbles_Lost_curr: stats.Fumbles_Lost_curr || 0,
    Forced_Fumbles_curr: stats.Forced_Fumbles_curr || 0,
    Interceptions_Thrown_curr: stats.Interceptions_Thrown_curr || 0,
    Sacks_curr: stats.Sacks_curr || 0,
    Blocked_Kicks_curr: stats.Blocked_Kicks_curr || 0,
    Blocked_Punts_curr: stats.Blocked_Punts_curr || 0,
    Safeties_curr: stats.Safeties_curr || 0,
    Kickoff_Return_TD_curr: stats.Kickoff_Return_TD_curr || 0,
    Punt_Return_TD_curr: stats.Punt_Return_TD_curr || 0,
    Defensive_TD_curr: stats.Defensive_TD_curr || 0,
    Punting_i20_curr: stats.Punting_i20_curr || 0,
    Punting_Yards_curr: stats.Punting_Yards_curr || 0,
  };
};

export const RunMatch = {
  type: new GraphQLList(GameRecordType),
  args: {
    league_id: { type: GraphQLString },
  },
  resolve: async (context, { league_id }, info) => {
    const { db } = context;
    const query = {
      league_id: league_id,
    };
    const league = await db
      .collection('leagues')
      .findOne({ _id: ObjectId(league_id) });

    const formula = league.formula;
    const week = league.gameWeek || 1;
    const schedule = await db
      .collection('schedule')
      .find({ league_id: league_id, week_no: week })
      .toArray();

    const loader = getLoader(
      context,
      'playerLoaderGenerator',
      playerLoaderGenerator
    );

    const result = schedule.map(async game => {
      const team1_id = game.first_team;
      const team2_id = game.second_team;

      //Have to put it in the correct format for teamMatchAlgorithm
      const arrangement1 = await db
        .collection('arrangement')
        .findOne({ fantasy_team_id: team1_id });

      const arrangement2 = await db
        .collection('arrangement')
        .findOne({ fantasy_team_id: team2_id });

      const players = positionKey.reduce((acc, key) => {
        if (arrangement1[key]) {
          acc.push(arrangement1[key]);
        }
        if (arrangement2[key]) {
          acc.push(arrangement2[key]);
        }
        return acc;
      }, []);

      const playerStats = await loader.loadMany(players || []);

      const starterStats1 = positionKey.map(key => {
        const playerId = arrangement1[key] || {};
        const stats =
          playerStats.filter(d => d._id.toString() === playerId)[0] || {};
        return defaultPlayerStat(stats);
      });

      const starterStats2 = positionKey.map(key => {
        const playerId = arrangement2[key] || {};
        const stats =
          playerStats.filter(d => d._id.toString() === playerId)[0] || {};
        return defaultPlayerStat(stats);
      });

      const team1 = {
        _id: team1_id,
        arrangement: starterStats1,
      };
      const team2 = {
        _id: team2_id,
        arrangement: starterStats2,
      };
      const outcome = match(league_id, week, team1, team2, formula);

      const data = {
        league_id: league_id,
        week: week,
        first_team: team1_id,
        second_team: team2_id,
        winner: outcome.winner,
        first_score: outcome.first_score,
        second_score: outcome.second_score,
      };
      if (outcome.winner === 0) {
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: ObjectId(team1_id) }, { $inc: { wins: 1 } });
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: ObjectId(team2_id) }, { $inc: { lose: 1 } });
      } else {
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: ObjectId(team2_id) }, { $inc: { wins: 1 } });
        db
          .collection('fantasy_team')
          .findOneAndUpdate({ _id: ObjectId(team1_id) }, { $inc: { lose: 1 } });
      }

      await db.collection('GAME_RECORD').insertOne(data);

      return data;
    });

    await db
      .collection('leagues')
      .findOneAndUpdate(
        { _id: ObjectId(league_id) },
        { $inc: { gameWeek: 1 } }
      );

    return result;
  },
};

export const SetSchedule = {
  type: ResultType,
  args: {
    data: { type: ScheduleInputType },
  },
  resolve: async (context, { data }, info) => {
    const { db } = context;
    const { league_id, weeks } = data;

    const leagueData = await db.collection('leagues').findOne({
      _id: ObjectId(league_id),
    });

    const account_ids = leagueData.accounts || [];

    // const loader = getLoader(
    //   context,
    //   'fantasyTeamByAccountsLoaderGenerator',
    //   fantasyTeamByAccountsLoaderGenerator
    // );
    // const fantasyTeams = await loader.loadMany(account_ids);
    const fantasyTeams = await Promise.all(
      account_ids.map(async account_id => {
        let query = {
          account_id,
          league_id,
        };
        const ret = await db.collection('fantasy_team').findOne(query);
        return ret;
      })
    );

    const fantasy_team_ids = fantasyTeams.map(d => d._id.toString());

    const r = prepareScheduleObject(weeks, fantasy_team_ids).map(d => {
      d.league_id = league_id;
      return d;
    });

    await db.collection('schedule').remove({
      league_id,
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

// Not used
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
      const fantasy_team_id = res.insertedIds[0].toString();
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
