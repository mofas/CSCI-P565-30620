import express from 'express';
import config from './config';
import mongodb from 'mongodb';
// import graphqlHTTP from 'express-graphql';
// import { schema } from './graphql/schema';

import HTTPStatus from 'http-status';
import { setup } from './serverUtil';

const main = async () => {
  // setup DB
  let db;
  try {
    db = await mongodb.MongoClient.connect(config.mongo.url, {});
  } catch (err) {
    console.warn({ err }, 'Cannot connect to mongodb');
    throw err;
  }

  let app = setup(express(), { config, db });

  //read
  app.get('/account/read/:username', async (req, rsp) => {
    const ret = await db
      .collection('accounts')
      .find({ username: req.params.username })
      .toArray();
    rsp.status(HTTPStatus.OK).send(ret);
  });

  //create
  app.get('/account/create', async (req, rsp) => {
    const { username, password } = req.query;
    // TOOD: Please writting to db, we should check
    // 1. is username already be used?
    // 2. username and password is legal?
    // 3. hash password.
    await db.collection('accounts').insertOne({
      username,
      password,
    });

    rsp.status(HTTPStatus.OK).send({
      message: 'Create account successfully',
    });
  });

  //list
  app.get('/account/list', async (req, rsp) => {
    const ret = await db
      .collection('accounts')
      .find({})
      .toArray();
    rsp.status(HTTPStatus.OK).send(ret);
  });

  app.listen(config.server.port);
};

main();
