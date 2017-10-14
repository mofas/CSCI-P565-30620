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

export const AccountType = new GraphQLObjectType({
  name: 'AccountType',
  fields: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },
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
    accounts: { type: new GraphQLList(AccountType) },
    current_pickup_accounts: { type: AccountType },
  },
});

export const LeagueInputType = new GraphQLInputObjectType({
  name: 'LeagueInputType',
  fields: {
    name: { type: GraphQLString },
    limit: { type: GraphQLInt },
  },
});
