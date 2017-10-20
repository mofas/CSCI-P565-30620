import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { ListPlayer, QueryPlayer, ListLeague, QueryAccount } from './query';

import { CreateLeague, JoinLeague } from './mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
      ListLeague,
      QueryAccount,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      CreateLeague,
      JoinLeague,
    },
  }),
});
