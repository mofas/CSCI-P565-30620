import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import {
  ListPlayer,
  QueryPlayer,
  ListLeague,
  QueryAccount,
  QueryPoolPlayer,
  GetMessages,
} from './query';

import {
  CreateLeague,
  JoinLeague,
  DeleteLeague,
  UpdateLeague,
  UpdateDraftNoLeague,
  SelectedPlayer,
  SendMessage,
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
      GetMessages,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      CreateLeague,
      JoinLeague,
      DeleteLeague,
      UpdateLeague,
      UpdateDraftNoLeague,
      SelectedPlayer,
      SendMessage,
    },
  }),
});
