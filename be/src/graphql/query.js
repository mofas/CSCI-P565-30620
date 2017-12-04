import mongodb, { ObjectId } from 'mongodb';
import request from 'request';

import {
  graphql,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import {
  AccountType,
  PlayerType,
  LeagueType,
  PoolPlayerType,
  FantasyTeamType,
  ArrangementType,
  MessageType,
  PoolPlayerWithUserType,
  ScheduleType,
  GameRecordType,
} from './model';

import {
  getLoader,
  playerLoaderGenerator,
  accountLoaderGenerator,
  leagueLoaderGenerator,
  fantasyTeamLoaderGenerator,
  arrangementLoaderGenerator,
} from './dataLoader';

export const ListPlayer = {
  type: new GraphQLList(PlayerType),
  args: {
    skip: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: async ({ db }, { skip, limit, lang }, info) => {
    let query = {};
    skip = skip || 0;
    limit = limit || 2000;
    const result = await db
      .collection('players')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },
};

export const QueryPlayer = {
  type: PlayerType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };
    const result = await db.collection('players').findOne(query);
    return result;
  },
};

export const ListLeague = {
  type: new GraphQLList(LeagueType),
  args: {},
  resolve: async ({ db }, { _id }, info) => {
    const result = await db
      .collection('leagues')
      .find({})
      .sort({ create_time: -1 })
      .toArray();
    return result;
  },
};

export const QueryLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };
    const result = await db.collection('leagues').findOne(query);
    return result;
  },
};

export const QueryAccount = {
  type: AccountType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };
    const result = await db.collection('accounts').findOne(query);
    return result;
  },
};

export const ListAccount = {
  type: new GraphQLList(AccountType),
  args: {},
  resolve: async ({ db }, {}, info) => {
    const query = {};
    const result = await db
      .collection('accounts')
      .find(query)
      .toArray();
    return result;
  },
};

export const QueryLeagueTeams = {
  type: new GraphQLList(FantasyTeamType),
  args: {
    league_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { league_id }, context) => {
    const loader = getLoader(
      context,
      'fantasyTeamLoaderGenerator',
      fantasyTeamLoaderGenerator
    );

    const teamRet = await db
      .collection('fantasy_team')
      .find({ league_id })
      .toArray();

    const teamIds = teamRet.map(d => d._id.toString());
    const result = await loader.loadMany(teamIds);
    return result;
  },
};
export const QueryFantasyTeam = {
  type: FantasyTeamType,
  args: {
    _id: { type: GraphQLString },
    league_id: { type: GraphQLString },
    account_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id, league_id, account_id }, context) => {
    const loader = getLoader(
      context,
      'fantasyTeamLoaderGenerator',
      fantasyTeamLoaderGenerator
    );
    if (league_id && account_id) {
      const ret = await db
        .collection('fantasy_team')
        .findOne({ account_id, league_id });
      if (ret) {
        const result = await loader.loadMany([ret._id.toString()]);
        return result[0];
      }
    } else if (_id) {
      const result = await loader.loadMany([_id] || []);
      return result[0];
    }
    return null;
  },
};

export const QueryTeamArrangement = {
  type: ArrangementType,
  args: {
    fantasy_team_id: { type: GraphQLString },
    league_id: { type: GraphQLString },
    account_id: { type: GraphQLString },
  },
  resolve: async (
    { db },
    { fantasy_team_id, league_id, account_id },
    context
  ) => {
    const loader = getLoader(
      context,
      'arrangementLoaderGenerator',
      arrangementLoaderGenerator
    );

    if (league_id && account_id) {
      const ret = await db
        .collection('fantasy_team')
        .findOne({ account_id, league_id });

      if (ret) {
        const fantasy_team_id = ret._id.toString();
        const result = await loader.loadMany([fantasy_team_id]);
        return result[0];
      }
    } else if (fantasy_team_id) {
      const result = await loader.loadMany([fantasy_team_id]);
      return result[0];
    }
    return null;
  },
};

export const QueryPoolPlayer = {
  type: new GraphQLList(PoolPlayerType),
  args: {
    league_id: { type: GraphQLString }, //league id
  },
  resolve: async ({ db }, { league_id }, info) => {
    const query = {
      league_id: league_id,
    };
    const result = await db
      .collection('pool')
      .find(query)
      .toArray();

    const accountsIds = result.map(d => d.account_id);
    const groupAccountId = accountsIds.reduce((acc, id) => {
      acc.add(id);
      return acc;
    }, new Set());

    const ret = [...groupAccountId].map(user_id => {
      return {
        user_id: user_id,
        players: result
          .filter(dd => dd.account_id === user_id)
          .map(dd => dd.player_id),
      };
    });
    return ret;
  },
};

export const QueryPoolPlayerWithUser = {
  type: new GraphQLList(PoolPlayerWithUserType),
  args: {
    league_id: { type: GraphQLString }, //league id
  },
  resolve: async ({ db }, { league_id }, info) => {
    // console.log("league_id: adas: ", league_id);
    const query = {
      league_id: league_id,
    };
    const result = await db
      .collection('pool')
      .find(query)
      .toArray();

    const groupByAccount = result.reduce((acc, d) => {
      const { account_id, player_id } = d;
      acc[account_id] = acc[account_id] || [];
      acc[account_id].push(player_id);
      return acc;
    }, {});
    // console.log(groupByAccount);

    const ret = Object.keys(groupByAccount).map(account_id => {
      return {
        account_id,
        players: groupByAccount[account_id],
      };
    });
    // console.log(ret);
    return ret;
  },
};

export const GetMessages = {
  type: new GraphQLList(MessageType),
  args: {
    room_id: { type: new GraphQLNonNull(GraphQLString) },
    skip: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: async ({ db }, { room_id, skip = 0, limit = 100 }, info) => {
    const query = { room_id };
    const result = await db
      .collection('messages')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },
};

export const QueryScheduleByLeagueId = {
  type: new GraphQLList(ScheduleType),
  args: {
    league_id: { type: GraphQLString }, //league id
  },
  resolve: async ({ db }, { league_id }, info) => {
    // console.log("league_id: adas: ", league_id);
    const query = {
      league_id: league_id,
    };
    const result = await db
      .collection('schedule')
      .find(query)
      .toArray();

    const ret = result.map(d => {
      return {
        first_team: d['first_team'],
        second_team: d['second_team'],
        league_id: d['league_id'],
        week_no: d['week_no'],
      };
    });
    // console.log(ret);
    return ret;
  },
};

export const QueryGameRecordByLeagueId = {
  type: new GraphQLList(GameRecordType),
  args: {
    league_id: { type: GraphQLString },
  },
  resolve: async ({ db }, { league_id }, info) => {
    // console.log("league_id: adas: ", league_id);
    const query = {
      league_id: league_id,
    };
    const result = await db
      .collection('game_record')
      .find(query)
      .toArray();

    const ret = result.map(d => {
      return {
        league_id: d['league_id'],
        week: d['week'],
        first_team_id: d['first_team'],
        second_team_id: d['second_team'],
        winner: d['winner'],
      };
    });
    return ret;
  },
};

export const ListTeam = {
  type: new GraphQLList(FantasyTeamType),
  args: {
    league_id: { type: GraphQLString }, //league id
    skip: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: async ({ db }, { skip, limit, lang, league_id }, info) => {
    let query = {
      league_id: league_id,
    };
    skip = skip || 0;
    limit = limit || 2000;
    const result = await db
      .collection('fantasy_team')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return result;
  },
};
