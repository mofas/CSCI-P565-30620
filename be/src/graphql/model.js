import { ObjectId } from 'mongodb';

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
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
} from 'graphql';

import {
  getLoader,
  playerLoaderGenerator,
  accountLoaderGenerator,
  leagueLoaderGenerator,
  arrangementLoaderGenerator,
} from './dataLoader';

export const ResultType = new GraphQLObjectType({
  name: 'ResultType',
  fields: {
    success: { type: GraphQLBoolean },
    error: { type: GraphQLString },
  },
});

export const AccountType = new GraphQLObjectType({
  name: 'AccountType',
  fields: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },
    ban: { type: GraphQLBoolean },
  },
});

export const PlayerType = new GraphQLObjectType({
  name: 'PlayerType',
  fields: {
    _id: { type: GraphQLString },
    Name: { type: GraphQLString },
    Position: { type: GraphQLString },
    Team: { type: GraphQLString },
    Passing_Yards: { type: GraphQLInt },
    Rushing_Yards: { type: GraphQLInt },
    Receiving_Yards: { type: GraphQLInt },
    Passing_TDs: { type: GraphQLInt },
    Rushing_TDs: { type: GraphQLInt },
    Receiving_TD: { type: GraphQLInt },
    FG_Made: { type: GraphQLInt },
    FG_Missed: { type: GraphQLInt },
    Extra_Points_Made: { type: GraphQLInt },
    Interceptions: { type: GraphQLInt },
    Fumbles_Lost: { type: GraphQLInt },
    Kickoff_Return_TD: { type: GraphQLInt },
    Interceptions_Thrown: { type: GraphQLInt },
    Forced_Fumbles: { type: GraphQLInt },
    Sacks: { type: GraphQLInt },
    Blocked_Kicks: { type: GraphQLInt },
    Blocked_Punts: { type: GraphQLInt },
    Safeties: { type: GraphQLInt },
    Punt_Return_TD: { type: GraphQLInt },
    Defensive_TD: { type: GraphQLInt },
    Punting_Yards: { type: GraphQLInt },
    Punting_i20: { type: GraphQLInt },
    Rank: { type: GraphQLInt },
    URL: { type: GraphQLString },
  },
});

export const LeagueType = new GraphQLObjectType({
  name: 'LeagueType',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    stage: { type: GraphQLString }, //Initial, Draft, Game, Finish
    limit: { type: GraphQLInt },
    draft_run: { type: GraphQLInt },
    formula: {type: new GraphQLObjectType({name: 'Formula',
          fields: {tdpass: {type:GraphQLInt},
                  passyds: {type:GraphQLInt},
                  tdrush: {type:GraphQLInt},
                  rushyds: {type:GraphQLInt},
                  tdrec: {type: GraphQLInt},
                  recyds: {type: GraphQLInt},
                  fgmade: {type: GraphQLInt},
                  fgmissed: {type: GraphQLInt},
                  xpmade: {type: GraphQLInt},
                  int: {type: GraphQLInt},
                  intthrow: {type: GraphQLInt},
                  fumlost: {type: GraphQLInt},
                  sack: {type: GraphQLInt},
                  forcedfum: {type: GraphQLInt},
                  kickblock: {type: GraphQLInt},
                  puntblock: {type: GraphQLInt},
                  saf: {type: GraphQLInt},
                  tdkickret: {type: GraphQLInt},
                  tdpuntret: {type: GraphQLInt},
                  tddef: {type: GraphQLInt},
                  i20punt: {type: GraphQLInt},
                  puntyds: {type: GraphQLInt},
                }})},
    creator: {
      type: AccountType,
      resolve: async ({ creator }, args, context) => {
        const loader = getLoader(
          context,
          'accountLoaderGenerator',
          accountLoaderGenerator
        );
        const result = await loader.loadMany([creator] || []);
        return result[0];
      },
    },
    create_time: { type: GraphQLInt },
    draft_start_time: { type: GraphQLInt },
    timeout: { type: GraphQLInt },
    lastPickTime: { type: GraphQLInt },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve: async ({ accounts }, args, context) => {
        const loader = getLoader(
          context,
          'accountLoaderGenerator',
          accountLoaderGenerator
        );
        return await loader.loadMany(accounts || []);
      },
    },
  },
});

export const LeagueInputType = new GraphQLInputObjectType({
  name: 'LeagueInputType',
  fields: {
    name: { type: GraphQLString },
    limit: { type: GraphQLInt },
    epoc_date: { type: GraphQLInt },
    formula: {type: new GraphQLInputObjectType({name: 'Formula_input',
  fields: {tdpass: {type:GraphQLInt},
  passyds: {type:GraphQLInt},
  tdrush: {type:GraphQLInt},
  rushyds: {type:GraphQLInt},
  tdrec: {type: GraphQLInt},
  recyds: {type: GraphQLInt},
  fgmade: {type: GraphQLInt},
  fgmissed: {type: GraphQLInt},
  xpmade: {type: GraphQLInt},
  int: {type: GraphQLInt},
  intthrow: {type: GraphQLInt},
  fumlost: {type: GraphQLInt},
  sack: {type: GraphQLInt},
  forcedfum: {type: GraphQLInt},
  kickblock: {type: GraphQLInt},
  puntblock: {type: GraphQLInt},
  saf: {type: GraphQLInt},
  tdkickret: {type: GraphQLInt},
  tdpuntret: {type: GraphQLInt},
  tddef: {type: GraphQLInt},
  i20punt: {type: GraphQLInt},
  puntyds: {type: GraphQLInt},
}})},
  },
});

export const PoolPlayerType = new GraphQLObjectType({
  name: 'PoolPlayerType',
  fields: {
    account: {
      type: AccountType,
      resolve: async ({ user_id }, args, context) => {
        const loader = getLoader(
          context,
          'accountLoaderGenerator',
          accountLoaderGenerator
        );
        const result = await loader.loadMany([user_id] || []);
        return result[0];
      },
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ players }, args, context) => {
        const loader = getLoader(
          context,
          'playerLoaderGenerator',
          playerLoaderGenerator
        );
        return await loader.loadMany(players || []);
      },
    },
  },
});

const arrangementTypeGetPlayerHelper = async (context, ids) => {
  const loader = getLoader(
    context,
    'playerLoaderGenerator',
    playerLoaderGenerator
  );
  return await loader.loadMany(ids || []);
};

export const ArrangementType = new GraphQLObjectType({
  name: 'ArrangementType',
  fields: {
    position_qb: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_qb }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_qb);
      },
    },
    position_rb: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_rb }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_rb);
      },
    },
    position_wr: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_wr }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_wr);
      },
    },
    position_te: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_te }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_te);
      },
    },
    position_k: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_k }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_k);
      },
    },
    position_defense: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_defense }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_defense);
      },
    },
    position_p: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ position_p }, args, context) => {
        return arrangementTypeGetPlayerHelper(context, position_p);
      },
    },
  },
});

export const FantasyTeamType = new GraphQLObjectType({
  name: 'FantasyTeamType',
  fields: {
    _id: { type: GraphQLString },
    account: {
      type: AccountType,
      resolve: async ({ account_id }, args, context) => {
        const loader = getLoader(
          context,
          'accountLoaderGenerator',
          accountLoaderGenerator
        );
        const result = await loader.loadMany([account_id] || []);
        return result[0];
      },
    },
    league: {
      type: LeagueType,
      resolve: async ({ league_id }, args, context) => {
        const loader = getLoader(
          context,
          'leagueLoaderGenerator',
          leagueLoaderGenerator
        );
        const result = await loader.loadMany([league_id] || []);
        return result[0];
      },
    },
    arrangement: {
      type: ArrangementType,
      resolve: async ({ _id }, args, context) => {
        const loader = getLoader(
          context,
          'arrangementLoaderGenerator',
          arrangementLoaderGenerator
        );
        const result = await loader.loadMany([_id.toString()] || []);
        return result[0];
      },
    },
    name: { type: GraphQLString },
    win: { type: GraphQLInt },
    lose: { type: GraphQLInt },
  },
});

export const MessageType = new GraphQLObjectType({
  name: 'MessageType',
  fields: {
    room_id: { type: GraphQLString },
    sender: { type: GraphQLString },
    message: { type: GraphQLString },
    date_time: { type: GraphQLInt },
  },
});
