import mongodb, { ObjectId } from 'mongodb';

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

import { LeagueType, LeagueInputType } from './model';

export const CreateLeague = {
  type: LeagueType,
  args: {
    data: { type: LeagueInputType },
  },
  resolve: async ({ db }, { data }, info) => {
    const { name, limit } = data;
    const savedData = {
      name,
      limit,
      stage: 'Initial',
      accounts: [],
      draft_run: 0,
      current_pickup_accounts: null,
    };

    const { value } = await db.collection('leagues').insertOne(savedData);
    return savedData;
  },
};
