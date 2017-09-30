import HTTPStatus from 'http-status';

export const successLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
  });
};

export const failLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'fail to login',
  });
};
