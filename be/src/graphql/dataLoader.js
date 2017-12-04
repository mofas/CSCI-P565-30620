import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

export const getLoader = (context, loadName, loadGenerator) => {
  let loader = context[loadName];
  if (!loader) {
    loader = context[loadName] = loadGenerator(context.db);
  }
  return loader;
};

export const accountLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      _id: { $in: ids.map(ObjectId) },
    };
    const result = await db
      .collection('accounts')
      .find(query)
      .toArray();
    return reorderWith(ids, result, '_id');
  });
};

export const leagueLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      _id: { $in: ids.map(ObjectId) },
    };
    const result = await db
      .collection('leagues')
      .find(query)
      .toArray();
    return reorderWith(ids, result, '_id');
  });
};

export const fantasyTeamLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      _id: { $in: ids.map(ObjectId) },
    };
    const result = await db
      .collection('fantasy_team')
      .find(query)
      .toArray();
    return reorderWith(ids, result, '_id');
  });
};

export const fantasyTeamByAccountsLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      account_id: { $in: ids },
    };
    const result = await db
      .collection('fantasy_team')
      .find(query)
      .toArray();
    return reorderWith(ids, result, 'account_id');
  });
};

// notice we load arrangement by team_id
export const arrangementLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      fantasy_team_id: { $in: ids },
    };
    const result = await db
      .collection('arrangement')
      .find(query)
      .toArray();
    return reorderWith(ids, result, 'fantasy_team_id');
  });
};

export const playerLoaderGenerator = db => {
  return new DataLoader(async ids => {
    let query = {
      _id: { $in: ids.map(ObjectId) },
    };
    const result = await db
      .collection('players')
      .find(query)
      .toArray();
    return reorderWith(ids, result, '_id');
  });
};

function reorderWith(orderedIds, unorderedDocs, key = '_id') {
  return orderedIds.map(
    id => unorderedDocs.find(doc => doc[key].toString() === id.toString()) || {}
  );
}
