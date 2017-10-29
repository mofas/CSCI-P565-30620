import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import {
  ListPlayer,
  QueryPlayer,
  ListLeague,
  QueryAccount,
  QueryPoolPlayer,
} from './query';

import {
  CreateLeague,
  JoinLeague,
  DeleteLeague,
  UpdateLeague,
  UpdateDraftNoLeague,
  SelectedPlayer,
} from './mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
      ListLeague,
      QueryPoolPlayer,
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
      UpdateLeague,
      UpdateDraftNoLeague,
      SelectedPlayer,
    },
  }),
});
