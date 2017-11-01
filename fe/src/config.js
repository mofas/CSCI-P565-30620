const DEFAULT_ENDPOINT_SET = {
  ENDPOINT: 'http://localhost:5000',
  WS_ENDPOINT: 'ws://localhost:5000',
  DUO_ENDPOINT: 'api-00cc3ec1.duosecurity.com',
};

const TESTING_ENDPOINT_SET = {
  ENDPOINT: 'https://csci.now.sh',
  WS_ENDPOINT: 'wss://csci.now.sh',
  DUO_ENDPOINT: 'api-00cc3ec1.duosecurity.com',
};

const getEndpoint = () => {
  if (process.env.REACT_APP_ENDPOINT === 'testing') {
    return TESTING_ENDPOINT_SET;
  }

  return DEFAULT_ENDPOINT_SET;
};

const targetEndpoint = getEndpoint();

export const OAUTH_URL = targetEndpoint.ENDPOINT + '/auth/google';
export const ENDPOINT = targetEndpoint.ENDPOINT;
export const WS_ENDPOINT = targetEndpoint.WS_ENDPOINT;
export const DUO_ENDPOINT = targetEndpoint.DUO_ENDPOINT;
