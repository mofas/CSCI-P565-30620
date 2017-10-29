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
    current_pickup_accounts: {
      type: AccountType,
      resolve: async ({ limit, draft_run, accounts }, args, { db }) => {
        const round = Math.round(draft_run / limit);
        //const round = Math.floor(draft_run / limit);
        const remind = draft_run % limit;
        //const round = 1;
        //const remind = 1;
        //console.log("qwee",round, remind, limit, draft_run);
        
        const currentAccountId = round % 2 === 0 ? accounts[remind] : accounts[accounts.length-remind-1];
        //console.log(round, remind, currentAccountId);
        const ret = await db
          .collection('accounts')
          .findOne({ _id: ObjectId(currentAccountId) });
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
