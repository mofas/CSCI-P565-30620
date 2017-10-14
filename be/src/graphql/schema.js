import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { ListPlayer, QueryPlayer, ListLeague } from './query';

import { CreateLeague } from './mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
      ListLeague,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      CreateLeague,
    },
  }),
});
