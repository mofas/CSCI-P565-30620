import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import {
  ListPlayer,
  QueryPlayer,
  ListLeague,
  QueryAccount,
  ListAccount,
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
  BanUser
} from './mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ListPlayer,
      QueryPlayer,
      ListLeague,
      QueryPoolPlayer,
	  ListAccount,
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
	  BanUser
    },
  }),
});
