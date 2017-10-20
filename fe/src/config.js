const DEFAULT_ENDPOINT_SET = {
  ENDPOINT: 'http://localhost:5000',
};

const TESTING_ENDPOINT_SET = {
  ENDPOINT: 'https://csci.now.sh',
};

const getEndpoint = () => {
  if (process.env.REACT_APP_ENDPOINT === 'testing') {
    return TESTING_ENDPOINT_SET;
  }

  return DEFAULT_ENDPOINT_SET;
};

const targetEndpoint = getEndpoint();

export const ENDPOINT = targetEndpoint.ENDPOINT;
