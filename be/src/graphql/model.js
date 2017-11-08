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
    creator: {
      type: AccountType,
      resolve: async ({ creator }, args, { db }) => {
        const ret = await db
          .collection('accounts')
          .findOne({ _id: ObjectId(creator) });
        return ret;
      },
    },
    create_time: { type: GraphQLInt },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve: async ({ accounts }, args, { db }) => {
        const ret = await db
          .collection('accounts')
          .find({ _id: { $in: accounts.map(ObjectId) } })
          .toArray();
        return ret;
      },
    },
  },
});

export const LeagueInputType = new GraphQLInputObjectType({
  name: 'LeagueInputType',
  fields: {
    name: { type: GraphQLString },
    limit: { type: GraphQLInt },
  },
});

export const PoolPlayerType = new GraphQLObjectType({
  name: 'PoolPlayerType',
  fields: {
    account: {
      type: AccountType,
      resolve: async ({ user_id }, args, { db }) => {
        const ret = await db
          .collection('accounts')
          .findOne({ _id: ObjectId(user_id) });
        return ret;
      },
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve: async ({ players }, args, { db }) => {
        const ret = await db
          .collection('players')
          .find({ _id: { $in: players.map(ObjectId) } })
          .toArray();
        return ret;
      },
    },
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
