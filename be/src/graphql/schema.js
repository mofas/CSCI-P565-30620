import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { ListPlayer, QueryPlayer } from './query';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
    },
  }),
});
