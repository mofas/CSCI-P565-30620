import { ENDPOINT } from '../config';
import request from 'superagent';

const handleUnauth = () => {
  window.location.href = '#/';
};

const Connector = (endpoint, preModifier, postModifier) => {
  return function(url) {
    let ret = null;

    if (typeof url === 'function') {
      ret = url(request, endpoint);
    } else {
      ret = request.get(endpoint + url);
    }

    if (typeof preModifier === 'function') {
      ret = preModifier(ret);
    }

    ret = ret.then(
      res => res,
      err => {
        if (err.status === 401) {
          handleUnauth();
        }
        return err;
      }
    );

    if (typeof postModifier === 'function') {
      ret = postModifier(ret);
    }

    return ret;
  };
};

const API = Connector(
  ENDPOINT,
  request => {
    return request.withCredentials();
  },
  request => {
    return request.then(res => {
      try {
        return JSON.parse(res.text);
      } catch (e) {
        return res;
      }
    });
  }
);

const GraphQL = (query, variables) => {
  return API((request, endpoint) => {
    return request
      .post(endpoint + '/graphql')
      .type('json')
      .send(JSON.stringify({ query, variables }));
  });
};

export default {
  API,
  GraphQL,
};
