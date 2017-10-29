import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { ListPlayer, QueryPlayer, ListLeague, QueryAccount } from './query';

import { CreateLeague, JoinLeague, DeleteLeague } from './mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
      ListLeague,
      // QueryLeaguePlayer, TODO
      QueryAccount,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      CreateLeague,
      JoinLeague,
      DeleteLeague,
      //SelectPlayer, TODO
    },
  }),
});
