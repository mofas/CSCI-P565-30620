import express from 'express';
import config from './config';
// import graphqlHTTP from 'express-graphql';
// import { schema } from './graphql/schema';

import HTTPStatus from 'http-status';
import { setup } from './serverUtil';

const main = () => {
  let app = setup(express(), { config });

  // app.use(
  //   '/graphql',
  //   graphqlHTTP({
  //     schema,
  //     context: {},
  //     rootValue: {
  //       config,
  //     },
  //     graphiql: true,
  //   })
  // );

  app.get('/echo/:info', (req, rsp, next) => {
    rsp.status(HTTPStatus.OK).send({
      message: req.params.info,
    });
  });

  app.get('/add/:n1/:n2', (req, rsp, next) => {
    rsp.status(HTTPStatus.OK).send({
      message: parseInt(req.params.n1) + parseInt(req.params.n2),
    });
  });

  app.listen(config.server.port);
};

main();
