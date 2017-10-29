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

import { AccountType, PlayerType, LeagueType, PoolPlayerType } from './model';

export const ListPlayer = {
  type: new GraphQLList(PlayerType),
  args: {
    skip: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: async ({ db }, { skip, limit, lang }, info) => {
    let query = {};
    skip = skip || 0;
    limit = limit || 100;
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
      .toArray();
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
