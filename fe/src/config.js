const DEFAULT_ENDPOINT_SET = {
  ENDPOINT: 'http://localhost:5000',
};

const STAGING_ENDPOINT_SET = {
  ENDPOINT: 'http://localhost:5000',
};

const getEndpoint = () => {
  if (process.env.ENDPOINT === 'staging') {
    return STAGING_ENDPOINT_SET;
  }

  return DEFAULT_ENDPOINT_SET;
};

const targetEndpoint = getEndpoint();

export const ENDPOINT = targetEndpoint.ENDPOINT;
