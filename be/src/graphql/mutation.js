import mongodb, { ObjectId } from 'mongodb';

import {
  graphql,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import { ResultType, LeagueType, LeagueInputType } from './model';

export const CreateLeague = {
  type: LeagueType,
  args: {
    data: { type: LeagueInputType },
  },
  resolve: async ({ db }, { data }, info) => {
    const { name, limit } = data;
    const savedData = {
      name,
      limit,
      stage: 'Initial',
      accounts: [],
      draft_run: 0,
      current_pickup_accounts: null,
    };

    const { value } = await db.collection('leagues').insertOne(savedData);
    return savedData;
  },
};


export const UpdateLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
    stage:{ type: GraphQLString}
  },
  resolve: async ({ req, db }, { _id, stage }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    console.log("456 stage:" , stage);
    //console.log("print " , req);
    //req.user = "test";

    const result = await db.collection('leagues').findOne(query);
    if (
      result.accounts.length === result.limit &&
      req.user
    ) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: {"stage": stage },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  },
};

export const UpdateDraftNoLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    //console.log("456 draft_no:" , draft_no);
    //console.log("print " , req);
    //req.user = "test";

    const result = await db.collection('leagues').findOne(query);
    if (
      result.accounts.length === result.limit &&
      req.user
    ) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: {"draft_run": result.draft_run + 1 },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      //console.log("in else section");
      return result;
    }
  },
};

export const JoinLeague = {
  type: LeagueType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ req, db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };

    const result = await db.collection('leagues').findOne(query);
    if (
      result.accounts.length < result.limit &&
      req.user &&
      !result.accounts.includes(req.user._id)
    ) {
      const { value } = await db.collection('leagues').findOneAndUpdate(
        {
          _id: ObjectId(result._id),
        },
        {
          $set: { accounts: [req.user._id, ...result.accounts] },
        },
        {
          returnOriginal: false,
        }
      );
      return value;
    } else {
      return result;
    }
  },
};

export const DeleteLeague = {
  type: ResultType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async ({ db }, { _id }, info) => {
    const query = {
      _id: ObjectId(_id),
    };
    const { result } = await db.collection('leagues').remove(query);
    if (result.ok) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: JSON.stringify(result),
        success: false,
      };
    }
  },
};




export const PoolPlayer = new GraphQLObjectType({
  name: 'PoolPlayer',
  fields: {
    //league_id:{type : GraphQLString},
    //fancy_team_id: {type: GraphQLString},
    player_id: {type: GraphQLString},
  },
});

export const SelectedPlayer = {
  type: new GraphQLList(PoolPlayer),
  args:{
    league_id: {type: GraphQLString},
    player_id: {type: GraphQLString},
    fancy_team_id: {type: GraphQLString},
  },
  resolve: async({db}, {league_id, player_id, fancy_team_id}, info) => {
    const query = {
      league_id: league_id,
      player_id: player_id,
      fancy_team_id: fancy_team_id,
    };
    console.log("39847293", league_id, player_id, fancy_team_id);
    const result = await db.collection('pool').findOne(query);
    //console.log(JSON.stringify(result, null, 2))
    if(!result){
      db.collection('pool').insertOne(query);
    }

    return await db.collection('pool').find({league_id : league_id}, {player_id:1, _id: 0}).toArray();
  },
};

