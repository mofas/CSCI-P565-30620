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
          $set: { accounts: [req.user._id, ...result.accounts] },
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
