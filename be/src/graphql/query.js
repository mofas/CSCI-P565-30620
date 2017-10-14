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

import { PlayerType, LeagueType } from './model';

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
