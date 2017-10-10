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

const PlayerType = new GraphQLObjectType({
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
  },
});

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
      .sort({ Name: -1 })
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
