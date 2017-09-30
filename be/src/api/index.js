import HTTPStatus from 'http-status';

export const indexHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'Work',
  });
};

export const getUserInfoHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send(
    Object.assign(
      {},
      {
        err: 0,
      },
      req.user
    )
  );
};

export const successLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'success login',
  });
};

export const failLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'fail to login',
  });
};
