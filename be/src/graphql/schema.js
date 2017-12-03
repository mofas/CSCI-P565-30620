import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import {
  ListPlayer,
  QueryPlayer,
  ListLeague,
  QueryLeague,
  QueryAccount,
  ListAccount,
  QueryPoolPlayer,
  QueryLeagueTeams,
  QueryFantasyTeam,
  QueryTeamArrangement,
  GetMessages,
  QueryPoolPlayerWithUser,
  QueryScheduleByLeagueId
} from './query';

import {
  CreateLeague,
  JoinLeague,
  DeleteLeague,
  UpdateLeague,
  UpdateDraftNoLeague,
  SelectedPlayer,
  ReleasePlayer,
  SendMessage,
  BanUser,
  UpdateLeagueTime,
  RunMatch,
  SetSchedule,
  CreateFantasyTeam,
  UpdateTeamArrangement
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
      QueryLeague,
      QueryLeagueTeams,
      QueryFantasyTeam,
      QueryTeamArrangement,
      QueryPoolPlayerWithUser,
      QueryScheduleByLeagueId
    }
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
      ReleasePlayer,
      SendMessage,
      BanUser,
      UpdateLeagueTime,
      RunMatch,
      SetSchedule,
      CreateFantasyTeam,
      UpdateTeamArrangement
    }
  })
});
